import { join } from "node:path";
import { scan, pathExists, mkdirs } from "fs-nextra";

import { BaseManager } from "./BaseManager.js";
import { Collection } from "../../extensions/Collection.js";
import { Logger } from "../../extensions/Logger.js";

/**
 * Base library class
 * @since 0.0.1
 */
export class BaseLibrary extends Collection {
	/**
	 * @param {*} inquirer Inquirer bot client
	 * @param {*} properties Library properties
	 */
	constructor(inquirer, properties = {}, values = []) {
		super(values);
		this.inquirer = inquirer;
		this._properties = properties;

		this._cache = new Collection();
		this._logger = new Logger(inquirer, {
			title: `library:${this.name}`,
		});
	}

	/**
	 * The library name
	 */
	get name() {
		if (!this._properties.name)
			throw new Error("Library must be have the option 'name'");
		return this._properties.name;
	}

	/**
	 * The library config
	 */
	get config() {
		return this.inquirer.constants.library;
	}

	/**
	 * Load library managers
	 */
	async loadManagers() {
		try {
			this._logger.debug("Loading managers...");

			const managersPaths = await this._loadManagersPaths();
			for (const managerPath of managersPaths) {
				const Manager = await this._importManager(managerPath);
				this.set(Manager.name, { class: Manager, path: managerPath });
				this._logger.debug(`Successfully loaded manager '${Manager.name}'`);
			}

			this._logger.debug(`Managers loading is complete`);
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

			let size = 0;
			for (const [name, Manager] of this.entries()) {
				this._logger.debug(`Initializing manager '${name}' ...`);

				const manager = new Manager.class(this.inquirer, {
					path: Manager.path,
					library: this,
				});

				await manager.loadModules();
				await manager.initializeModules();

				this._cache.set(manager.name, manager);
				size += manager.modules.size;

				this._logger.debug(
					`Successfully initialized manager '${manager.name}'`
				);
			}
			this._logger.debug("Managers initializing is complete");
			return size;
		} catch (error) {
			this._logger.fatal(
				"An error occurred while initializing managers",
				error
			);
		}
	}

	/**
	 * Load managers paths
	 * @returns Managers paths Array
	 */
	async _loadManagersPaths() {
		const path = join(this._properties.path, this.config.managerFolderName);
		const folderExists = await pathExists(path);
		const folderEnsure = this.inquirer.constants.folderEnsure;
		if (!folderExists) {
			if (!folderEnsure) throw new Error(`Path '${path}' is no exists`);
			await mkdirs(path);
			return [];
		}

		const files = await scan(path, {
			filter: (stat) => stat.isFile() && stat.name.endsWith(".js"),
		});
		return (await Promise.all([...files])).map((i) => i[0]);
	}

	/**
	 * Import manager by path
	 * @param {*} managerPath The manager path
	 * @returns Manager class
	 */
	async _importManager(managerPath) {
		const ManagerFile = await import(join("file:///", managerPath));
		const Manager = Object.values(ManagerFile).find(
			(i) => this._isClass(i) && Object.getPrototypeOf(i) === BaseManager
		);
		if (!Manager) throw new Error(`${managerPath}:\nManager is not defined`);
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
