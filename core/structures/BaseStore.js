import { join, basename } from "node:path";
import { scan } from "fs-nextra";

import { Collection } from "../../extensions/Collection.js";
import { Logger } from "../../extensions/Logger.js";

/**
 * Base store class
 * @since 0.0.1
 */
export class BaseStore extends Collection {
	constructor(inquirer, { name, path, sortManagers = false }, values = []) {
		super({ assignProperties: true }, values);
		this.inquirer = inquirer;

		Object.defineProperties(this, {
			name: {
				value: name,
				writable: false,
				configurable: false,
			},
			path: {
				value: path,
				writable: false,
				configurable: false,
			},
			sortManagers: {
				value: sortManagers,
				writable: false,
				configurable: false,
			},
			_logger: {
				value: new Logger(inquirer, { title: `store:${name}` }),
				writable: false,
				enumerable: false,
				configurable: false,
			},
		});
		this.cache = new Collection();
	}

	/**
	 * Load store managers
	 */
	async loadManagers() {
		try {
			this._logger.debug("Loading managers...");

			const managersDirectories = await this._loadManagersDirectories(
				this.path
			);
			for (const managerDirectory of managersDirectories) {
				const pathToManagerFile = await this._getPathToManagerFile(
					managerDirectory
				);

				const Manager = await this._importManager(pathToManagerFile);
				const name = basename(managerDirectory);
				this.cache.set(name, { Manager, path: pathToManagerFile });

				this._logger.debug(`Successfully loaded manager '${Manager.name}'`);
			}

			this._logger.complete(
				`Successfully loaded ${this.cache.size} managers`,
				"Managers loading is complete"
			);
		} catch (error) {
			this._logger.fatal("An error occurred while loading managers", error);
		}
	}

	/**
	 * Initialize store managers
	 */
	async initializeManagers() {
		try {
			this._logger.debug("Initializing managers...");

			const managers = this.sortManagers
				? [...this.cache.entries()].sort((a, b) => (a < b ? 1 : -1))
				: this.cache.entries();
			let size = 0;
			for (const [name, { Manager, path }] of managers) {
				this._logger.debug(`Initializing manager '${name}' ...`);

				const manager = new Manager(this.inquirer, {
					name,
					path,
					store: this,
				});
				if (manager._prepareModules) manager._prepareModules();
				await manager.handleModules();
				this.set(name, manager);

				size += manager.modules.size;
				this._logger.debug(`Successfully initialized manager '${name}'`);
			}
			this._logger.complete(
				`Successfully initialized ${this.size} managers`,
				"Managers initialization is complete"
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
	async _getPathToManagerFile(directory) {
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
