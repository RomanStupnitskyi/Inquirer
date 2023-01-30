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
		this.#default = this.inquirer.constants.library;
		this.title = `${this.baseName}:${this.name}`;

		this.collections = [];
		this.controllers = new Collection();
	}

	/**
	 * String identifier of library
	 * @since 0.0.1
	 */
	get name() {
		if (!this.#parameters.name)
			throw new Error("Library must be have the option 'name'");
		return this.#parameters.name;
	}

	/**
	 * Base name of library
	 * @since 0.0.1
	 */
	get baseName() {
		return this.#default.name;
	}

	/**
	 * Library modules
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
	 * The path to library source folder
	 * @since 0.0.1
	 */
	get path() {
		return this.inquirer.constants.paths[this.name];
	}

	/**
	 * Load the library modules
	 * @since 0.0.1
	 */
	async loadLibrary() {
		try {
			const directories = await this._loadLibraryCollections();
			for (const directory of directories) {
				const libraryFiles = await this._getLibraryFiles(directory.path);
				for (const filePath of libraryFiles) {
					const module = await this._importModuleFile(directory, filePath);
					this._addModule(module);
				}
			}
			this.collections.sort((a, b) => (a > b ? -1 : 1));
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
	async initializeLibrary() {
		let size = 0;
		try {
			if (this._prepareModules) await this._prepareModules();
			for (const collectionName of this.collections) {
				const collection = this[collectionName];
				collection.forEach(async (module) =>
					module.initialize ? module.initialize() : null
				);
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
	 * Load the library collections
	 * @since 0.0.1
	 * @returns Library collections as names
	 */
	async _loadLibraryCollections() {
		const folders = (
			await scan(this.path, {
				filter: (stat) => stat.isDirectory(),
			})
		).keys();

		const directories = [];
		for (const folder of folders) {
			const baseName = basename(folder);
			this[baseName] = new Collection();
			this.collections.push(baseName);
			directories.push({ path: folder, baseName });
		}
		return directories;
	}

	/**
	 * Get the files paths from path
	 * @since 0.0.1
	 * @param {*} path Path to files
	 * @returns Files paths
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
	 * Import the module from file
	 * @since 0.0.1
	 * @param {*} directory Directory of file
	 * @param {*} filePath Path of file
	 * @returns Imported library module or undefined if error
	 */
	async _importModuleFile(directory, filePath) {
		try {
			const Module = await import(join("file:///", filePath));
			if (!BaseLibrary._isClass(Module.default)) {
				this.inquirer.logger.fatal(
					this.title,
					`Class is not exported or exported without default`
				);
			}

			Module.default.prototype.library = this;
			Module.default.prototype.baseName = directory.baseName;

			const module = new Module.default(this.inquirer);
			if (!module.name)
				return this.inquirer.logger.fatal(
					this.title,
					"Accidence is no instanceof by base class"
				);

			const base = this.modules[module.baseName];
			if (!BaseLibrary._isClass(base)) {
				this.inquirer.logger.fatal(
					this.title,
					`Base class is not a class. Please check the option 'multiBase'`
				);
			}
			if (!(module instanceof base)) {
				this.inquirer.logger.fatal(
					this.title,
					`Module is no instanceof by base class`
				);
			}
			return module.dependent ? Module.default : module;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`${filePath}:\nModule doesn't imported: ${error}`
			);
			return undefined;
		}
	}

	/**
	 * Add module to collection
	 * @since 0.0.1
	 * @param {*} module The motule to add
	 * @returns Boolean value
	 */
	_addModule(module) {
		try {
			let collection = this[module.baseName || module.prototype.baseName];
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
	 * @returns Boolean
	 */
	static _isClass(input) {
		return (
			typeof input === "function" &&
			typeof input.prototype === "object" &&
			input.toString().substring(0, 5) === "class"
		);
	}
}
