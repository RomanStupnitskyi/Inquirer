import { basename, join } from "node:path";
import { scan, pathExists, mkdirs } from "fs-nextra";
import { Collection } from "../Collection.js";

/**
 * Base library class
 * @since 0.0.1
 */
export class BaseLibrary {
	#parameters;
	#default;

	constructor(inquirer, parameters = {}) {
		this.inquirer = inquirer;
		this.#parameters = parameters;
		this.#default = this.inquirer.constants.defaultParameters.library;

		this.cache = new Collection();
		this.collections = [];
	}

	/**
	 * The library string identifier
	 * @since 0.0.1
	 */
	get name() {
		if (!this.#parameters.name)
			throw new Error("Library must be have the option 'name'");
		return this.#parameters.name;
	}

	/**
	 * Then library basename
	 * @since 0.0.1
	 */
	get baseName() {
		return this.#default.baseName;
	}

	/**
	 * The library title
	 * @since 0.0.1
	 */
	get title() {
		return `${this.baseName}:${this.name}`;
	}

	/**
	 * The library modules
	 * @since 0.0.1
	 */
	get modules() {
		if (
			!this.#parameters.modules ||
			typeof this.#parameters.modules !== "object" ||
			this.#parameters[Symbol.iterator]
		)
			throw new Error(
				`Option 'modules' is not valid or not specified in library '${this.name}'`
			);
		return this.#parameters.modules || this.#default.modules;
	}

	/**
	 * The library path of source folder
	 * @since 0.0.1
	 */
	get path() {
		return this.inquirer.constants.paths[this.name];
	}

	/**
	 * Load the library modules
	 * @since 0.0.1
	 */
	async loadModules() {
		try {
			const directories = await this._loadLibraryDirectories();
			for (const directory of directories) {
				const libraryFiles = await this._getLibraryFiles(directory.path);
				for (const filePath of libraryFiles) {
					const Module = await this._importModuleFile(directory, filePath);
					this._addModule(Module);
				}
			}
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`An error occurred while loaded modules: ${error}`
			);
		}
	}

	/**
	 * Initialize the library modules
	 * @since 0.0.1
	 * @returns Modules size
	 */
	async initializeModules() {
		let size = 0;
		try {
			if (this._prepareModules) await this._prepareModules();
			for (const collectionName of this.collections) {
				const collection = this[collectionName];
				collection.forEach((Module) => {
					if (!Module.prototype.config.dependent) {
						const module = new Module(this.inquirer, {
							production: true,
						});
						this.cache.set(module.name, module);
					}
				});
				size += collection.size;
			}
			return size;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`Initialize module error:\n${error}`
			);
			return size;
		}
	}

	/**
	 * Load the library directories
	 * @since 0.0.1
	 * @returns Library directories as object with keys ["path", "baseName"]
	 */
	async _loadLibraryDirectories() {
		const folders = (
			await scan(this.path, {
				filter: (stat) => stat.isDirectory(),
			})
		).keys();

		const directories = [];
		for (const folder of folders) {
			const folderBaseName = basename(folder);
			this[folderBaseName] = new Collection();
			this.collections.push(folderBaseName);
			directories.push({
				path: folder,
				folderBaseName,
			});
		}
		this.collections.sort((a, b) => (a > b ? -1 : 1));
		return directories;
	}

	/**
	 * Get the library files from the library folder
	 * @since 0.0.1
	 * @param {*} path The library folder path
	 * @returns Modules files paths as array
	 */
	async _getLibraryFiles(path) {
		const folderExists = await pathExists(path);
		const folderEnsure = this.inquirer.constants.folderEnsure;
		if (!folderExists) {
			if (!folderEnsure) throw new Error(`Path cannot exists '${path}'`);
			await mkdirs(path);
			return [];
		}
		const files = await scan(path, {
			filter: (stat) => stat.isFile() && stat.name.endsWith(".js"),
		});
		return (await Promise.all([...files])).map((i) => i[0]);
	}

	/**
	 * Import the module from file path
	 * @since 0.0.1
	 * @param {*} directory The file directory
	 * @param {*} filePath The file path
	 * @returns Imported library module or undefined if error
	 */
	async _importModuleFile(directory, filePath) {
		try {
			const Module = await import(join("file:///", filePath));
			if (!this._isClass(Module.default)) {
				this.inquirer.logger.fatal(
					this.title,
					`Class is not exported or exported without default`
				);
			}
			const module = new Module.default(this.inquirer, {
				production: false,
			});
			const moduleDefault =
				this.inquirer.constants.defaultParameters[directory.folderBaseName];
			const moduleBaseName = moduleDefault.baseName;
			const Controller =
				this.inquirer.controllers[this.name].get(moduleBaseName);

			Module.default.prototype.library = this;
			Module.default.prototype.config = module.config;
			Module.default.prototype.directory = directory;
			Module.default.prototype.default = moduleDefault;
			Module.default.prototype.Controller = Controller;

			const base = this.modules[moduleBaseName];
			if (!this._isClass(base)) {
				this.inquirer.logger.fatal(
					this.title,
					`Base class is not a class.`
				);
			}
			if (!(module instanceof base)) {
				this.inquirer.logger.fatal(
					this.title,
					`Module is no instanceof by base class`
				);
			}
			return Module.default;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`${filePath}:\nModule doesn't imported: ${error}`
			);
			return undefined;
		}
	}

	/**
	 * Add the module to collection
	 * @since 0.0.1
	 * @param {*} module The module to add
	 * @returns Boolean value (true if successfully added else false)
	 */
	_addModule(module) {
		try {
			let collection = this[module.prototype.directory.folderBaseName];
			collection.set(module.name, module);
			return true;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`Collection '${module.baseName}' is not found: ${error}`
			);
			return false;
		}
	}

	/**
	 * Check value is class
	 * @since 0.0.1
	 * @param {*} input Some value
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
