import { scan, pathExists, mkdirs } from "fs-nextra";
import { join } from "node:path";

import { Logger } from "../../extensions/Logger.js";
import { Collection } from "../../extensions/Collection.js";

/**
 * Base manager class
 * @since 0.0.1
 * @extends Logger
 */
export class BaseManager {
	/**
	 * @param {*} inquirer Inquirer bot client
	 * @param {*} data The manager's data config
	 * @param {*} options The EventEmitter's options
	 */
	constructor(inquirer, { name, module, ...properties }) {
		this.inquirer = inquirer;

		this.name = name;
		this.module = module;
		Object.defineProperty(this, "_properties", {
			value: properties,
			writable: false,
			enumerable: false,
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
	 * Load manager modules
	 */
	async loadModules() {
		try {
			this._logger.debug("Loading modules...");

			const modulesPathFolder = join(
				this.inquirer.constants.paths[this._properties.library.name],
				this.name
			);
			const modulesPaths = await this._loadModulePaths(modulesPathFolder);
			for (const modulePath of modulesPaths) {
				const ModuleFile = await import(join("file:///", modulePath));
				const Module = Object.values(ModuleFile).find(
					(module) =>
						this._isClass(module) &&
						Object.getPrototypeOf(module) === this.module.base
				);
				if (!Module) {
					this.warn(
						`Module is not loaded: Module '${Module.name}' is not a class or is not instance of by base class`
					);
					continue;
				}
				this.modules.set(Module.name, Module);
				this._logger.debug(`Module '${Module.name}' successfully loaded`);
			}

			this._logger.debug(
				`Loading modules is complete\nSuccessfully loaded ${this.modules.size} modules`
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

			for (const Module of this.modules.values()) {
				const module = new Module(this.inquirer, {
					manager: this,
					module: this.module,
				});

				module.initialize();
				this.cache.set(module.name, module);
			}

			this._logger.debug(
				`Modules initialization is complete\nSuccessfully initialized ${this.cache.size} modules`
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
