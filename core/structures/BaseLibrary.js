import { join, basename } from "node:path";
import { scan, pathExists, mkdirs } from "fs-nextra";

import { BaseManager } from "./BaseManager.js";
import { Collection } from "../../extensions/Collection.js";
import { Logger } from "../../extensions/Logger.js";

/**
 * Base library class
 * @since 0.0.1
 */
export class BaseLibrary extends Collection {
	constructor(inquirer, properties = {}, values = []) {
		super(values);
		this.inquirer = inquirer;
		Object.defineProperty(this, "_properties", {
			value: properties,
			writable: false,
			enumerable: false,
			configurable: false,
		});

		this.cache = new Collection();
		Object.defineProperty(this, "_logger", {
			value: new Logger(inquirer, { title: `library:${this.name}` }),
			writable: false,
			enumerable: false,
			configurable: false,
		});
	}

	/**
	 * The library name
	 */
	get name() {
		return this._properties.name;
	}

	/**
	 * The library parameters
	 */
	get _parameters() {
		return this.inquirer.constants.library;
	}

	/**
	 * Load library managers
	 */
	async loadManagers() {
		try {
			this._logger.debug("Loading managers...");

			const pathRoot = this._properties.path;
			const managersDirectories = await this._loadManagersDirectories(
				pathRoot
			);
			for (const managerDirectory of managersDirectories) {
				const pathToManagerFile = await this._loadPathToManagerFile(
					managerDirectory
				);

				const Manager = await this._importManager(pathToManagerFile);
				const name = basename(managerDirectory);
				this.cache.set(name, { class: Manager, path: pathToManagerFile });

				this._logger.debug(`Successfully loaded manager '${Manager.name}'`);
			}

			this._logger.complete(
				`Successfully loaded ${this.cache.size} managers\nManagers loading is complete`
			);
		} catch (error) {
			this._logger.fatal("An error occurred while loading managers", error);
		}
	}

	/**
	 * Initialize library managers
	 */
	async initializeManagers() {
		try {
			this._logger.debug("Initializing managers...");

			// middlewares will not work without sorting (middlewares must be
			// initializing before listeners), otherwise the sorting can be deleted
			const managers =
				this.name === "observers"
					? [...this.cache.entries()].sort((a, b) => (a < b ? 1 : -1))
					: this.cache.entries();

			let size = 0;
			for (const [name, Manager] of managers) {
				this._logger.debug(`Initializing manager '${name}' ...`);

				const manager = new Manager.class(this.inquirer, {
					name,
					path: Manager.path,
					library: this,
				});
				await manager.handleModules();

				this.set(name, manager);
				size += manager.modules.size;

				this._logger.debug(`Successfully initialized manager '${name}'`);
			}
			this._logger.complete(
				`Successfully initialized ${this.size} managers\nManagers initializing is complete`
			);
			return size;
		} catch (error) {
			this._logger.fatal(
				"An error occurred while initializing managers",
				error
			);
		}
	}

	/**
	 * Get manager by name
	 * @param {*} name The manager name
	 * @returns The manager or undefined
	 */
	getManager(name) {
		return this.get(name);
	}

	/**
	 * Load managers' directories
	 * @returns Managers paths Array
	 */
	async _loadManagersDirectories(path) {
		const files = await scan(path, {
			filter: (stat) => stat.isDirectory(),
		});
		return files.keys();
	}

	/**
	 * Load path to the manager file
	 * @param {*} directory The manager's directory
	 * @returns Path to the manager file
	 */
	async _loadPathToManagerFile(directory) {
		const files = (
			await scan(directory, {
				filter: (state) => state.isFile() && state.name.endsWith(".js"),
				depthLimit: -1,
			})
		).keys();
		return [...files][0];
	}

	/**
	 * Import manager by path
	 * @param {*} pathToManager Path to manager file
	 * @returns Manager class
	 */
	async _importManager(pathToManager) {
		const ManagerFile = await import(join("file:///", pathToManager));
		const Manager = ManagerFile.default;
		if (!Manager)
			this._logger.fatal(
				`${pathToManager} Manager is not defined or exported without default`
			);
		return Manager;
	}

	/**
	 * Check the value is a class
	 * @param {*} input The value to check
	 * @returns Boolean value
	 */
	_isClass(input) {
		return (
			typeof input === "function" &&
			typeof input.prototype === "object" &&
			input.toString().substring(0, 5) === "class"
		);
	}
}
