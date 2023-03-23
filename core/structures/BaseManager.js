import { scan, pathExists, mkdirs } from "fs-nextra";
import { join } from "node:path";

import { Logger } from "../../extensions/Logger.js";
import { Collection } from "../../extensions/Collection.js";

/**
 * Base manager class
 * @since 0.0.1
 */
export class BaseManager {
	constructor(inquirer, { name, module, store }) {
		this.inquirer = inquirer;
		this.store = store;

		Object.defineProperties(this, {
			name: {
				value: name,
				writable: false,
				configurable: false,
			},
			baseModule: {
				value: module,
				writable: false,
				configurable: false,
			},
			_logger: {
				value: new Logger(inquirer, { title: `manager:${name}` }),
				writable: false,
				enumerable: false,
				configurable: false,
			},
		});

		this.modules = new Collection();
		this.cache = new Collection();
	}

	/**
	 * Returns the module with the specified name, if it exists in the manager's modules map.
	 * @param {string} name - The name of the module to retrieve.
	 * @returns {object | undefined} - The module with the specified name, or undefined if it does not exist.
	 */
	getModule(name) {
		return this.modules.get(name);
	}

	/**
	 * Handle manager modules
	 * @returns {Promise<void>} A promise that resolves when module handling is complete
	 */
	async handleModules() {
		try {
			this._logger.debug("Handling modules...");

			if (this.prepareModules) {
				this.prepareModules();
			}

			const modulesFolderPath = join(
				this.inquirer.constants.paths.source,
				this.store.name,
				this.name
			);

			const moduleFilePaths = await this._loadModulePaths(modulesFolderPath);
			for (const moduleFilePath of moduleFilePaths) {
				const module = await this._importModule(moduleFilePath);
				this.load(module);

				this._logger.debug(`Module '${module.name}' successfully handled`);
			}

			const numModulesHandled = this.cache.size;
			this._logger.complete(
				`Successfully handled ${numModulesHandled} modules`,
				"Module handling complete"
			);
		} catch (error) {
			this._logger.fatal(error);
		}
	}

	/**
	 * Load a module by its name or class
	 * @param {string | Function} identifier - The module name or class
	 * @returns {object} The loaded module
	 * @throws {Error} If the identifier is invalid
	 */
	load(identifier) {
		if (typeof identifier === "string") {
			const cachedModule = this.cache.get(identifier);
			if (!cachedModule) {
				throw new Error(`Module '${identifier}' not found in cache`);
			}
			const module = this._initializeModule(cachedModule);
			return module;
		}

		if (typeof identifier === "function") {
			const module = this._initializeModule(identifier);
			const moduleName = module.name;

			this.cache.set(moduleName, identifier);
			this.modules.set(moduleName, module);
			return module;
		}

		throw new Error("Invalid module identifier");
	}

	/**
	 * Remove a loaded module from the manager.
	 * @param {string} name - The name of the module to unload.
	 * @returns {object | undefined} The unloaded module, or undefined if it wasn't found.
	 */
	unload(name) {
		const module = this.modules.get(name);
		this.modules.delete(name);

		return module;
	}

	/**
	 * Initialize a manager module
	 * @private
	 * @param {class} Module - The module class to be initialized
	 * @returns {object} The initialized module
	 */
	_initializeModule(Module) {
		try {
			this._logger.debug(`Initializing module ${Module.name}...`);

			const module = new Module(this.inquirer, {
				manager: this,
				base: this.baseModule,
			});

			if (module.initialize) {
				module.initialize();
			}

			this._logger.debug(
				`Module '${module.name}' initialization is complete`
			);
			return module;
		} catch (error) {
			this._logger.fatal(error);
		}
	}

	/**
	 * Load module paths
	 * @private
	 * @param {string} path - The path to the modules
	 * @returns {Promise<Array>} An array of module paths
	 */
	async _loadModulePaths(path) {
		const folderExists = await pathExists(path);
		const folderEnsure = this.inquirer.constants.folderEnsure;

		if (!folderExists) {
			if (!folderEnsure) {
				throw new Error(`Path '${path}' does not exist`);
			}

			await mkdirs(path);
			return [];
		}

		const files = await scan(path, {
			filter: (stat) => stat.isFile() && stat.name.endsWith(".js"),
		});

		const paths = await Promise.all([...files].map(([pathData]) => pathData));
		return paths;
	}

	/**
	 * Imports a module from the specified file path
	 * @private
	 * @param {string} pathToModule - The file path of the module to be imported
	 * @returns {Promise<object>} A promise that resolves to the imported module
	 */
	async _importModule(pathToModule) {
		try {
			const module = await import(`file:///${pathToModule}`);
			const Module = Object.values(module).find(
				(m) =>
					this._isClass(m) &&
					Object.getPrototypeOf(m) === this.baseModule.baseclass
			);

			if (!Module) {
				throw new Error(
					`Module at path ${pathToModule} is not loaded: Module is not a class or is not instance of the base class.`
				);
			}

			return Module;
		} catch (error) {
			this._logger.fatal(error);
		}
	}

	/**
	 * Determines if a given value is a class constructor
	 * @private
	 * @param {*} input - The value to check
	 * @returns {boolean} True if input is a class constructor, false otherwise
	 */
	_isClass(input) {
		return (
			typeof input === "function" &&
			typeof input.prototype === "object" &&
			input.toString().substring(0, 5) === "class"
		);
	}
}
