import { scan, pathExists, mkdirs } from "fs-nextra";
import { join } from "node:path";

import { Logger } from "../../extensions/Logger.js";
import { Collection } from "../../extensions/Collection.js";

/**
 * Base manager class
 * @since 0.0.1
 */
export class BaseManager {
	constructor(inquirer, properties = {}) {
		this.inquirer = inquirer;

		Object.defineProperty(this, "_properties", {
			value: properties,
			writable: false,
			enumerable: false,
			configurable: false,
		});
		Object.defineProperty(this, "_logger", {
			value: new Logger(inquirer, { title: `manager:${this.name}` }),
			enumerable: true,
			configurable: false,
		});

		this.modules = new Collection();
		this.cache = new Collection();
	}

	/**
	 * The manager's name
	 */
	get name() {
		return this._properties.name;
	}

	/**
	 * The module base configuration
	 */
	get module() {
		return this._properties.module;
	}

	/**
	 * The manager's library
	 */
	get library() {
		return this._properties.library;
	}

	/**
	 * Load manager modules
	 */
	async loadModules() {
		try {
			this._logger.debug("Loading modules...");

			const modulesPathFolder = join(
				this.inquirer.constants.paths.source,
				this.library.name,
				this.name
			);
			const pathsToModules = await this._loadModulePaths(modulesPathFolder);
			for (const pathToModule of pathsToModules) {
				const Module = await this._importModule(pathToModule);

				const name =
					Module.name === "default"
						? basename(pathToModule).replace(/\.js/, "")
						: Module.name;
				if (this.cache.has(name)) {
					this._logger.warn(`Module ${name} already exists`);
					continue;
				}
				this.cache.set(name, Module);
				this._logger.debug(`Module '${Module.name}' successfully loaded`);
			}

			this._logger.debug(
				`Successfully loaded ${this.cache.size} modules\nLoading modules is complete`
			);
		} catch (error) {
			this._logger.fatal(error);
		}
	}

	/**
	 * Initialize manager modules
	 */
	async initializeModules() {
		try {
			this._logger.debug("Initializing modules...");

			if (this._prepareModules) {
				this._prepareModules();
				this._logger.debug("Modules successfully preparing");
			}

			for (const Module of this.cache.values()) {
				const module = new Module(this.inquirer, {
					manager: this,
					base: this.module,
				});

				module.initialize();
				this.modules.set(module.name, module);
			}

			this._logger.debug(
				`Successfully initialized ${this.modules.size} modules\nModules initialization is complete`
			);
		} catch (error) {
			this._logger.fatal(error);
		}
	}

	/**
	 * Load module paths
	 * @param {*} path Path to modules
	 * @returns Paths array
	 */
	async _loadModulePaths(path) {
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
		return (await Promise.all([...files])).map((pathData) => pathData[0]);
	}

	/**
	 * Import module
	 * @param {*} pathToModule Path to module
	 * @returns The module
	 */
	async _importModule(pathToModule) {
		const ModuleFile = await import(join("file:///", pathToModule));
		const Module = Object.values(ModuleFile).find(
			(module) =>
				this._isClass(module) &&
				Object.getPrototypeOf(module) === this.module.baseclass
		);
		if (!Module) {
			this._logger.fatal(
				`${pathToModule} \nModule is not loaded: Module is not a class or is not instance of by base class`
			);
		}
		return Module;
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
