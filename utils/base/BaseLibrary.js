import { basename, join } from "node:path";
import { scan, pathExists, mkdirs } from "fs-nextra";
import { Collection } from "../Collection.js";

/**
 * Base class of libraries
 * @since 0.0.1
 */
export class BaseLibrary {
	#parameters;
	#default;

	constructor(inquirer, parameters = {}) {
		this.inquirer = inquirer;
		this.#parameters = parameters;
		this.#default = this.inquirer.constants.libraryDefault;
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
	 * Load the library accidences
	 * @since 0.0.1
	 */
	async loadLibrary() {
		try {
			const directories = await this._loadLibraryCollections();
			for (const directory of directories) {
				const libraryFiles = await this._getLibraryFiles(directory.path);
				for (const filePath of libraryFiles) {
					const accidence = await this._importAccidenceFile(
						directory,
						filePath
					);

					const Controller = this.controllers.get(accidence.baseName);
					if (Controller) {
						accidence.controller = new Controller(
							this.inquirer,
							accidence
						);
						accidence.controller.initialize();
					}
					this._setAccidence(accidence);
				}
			}
			this.collections.sort((a, b) => (a > b ? -1 : 1));
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`An error occurred while loaded accidences: ${error}`
			);
		}
	}

	/**
	 * Initialize the library accidences
	 * @since 0.0.1
	 * @returns Accidences size
	 */
	async initializeLibrary() {
		let size = 0;
		try {
			if (this._prepareAccidences) await this._prepareAccidences();
			for (const collectionName of this.collections) {
				const collection = this[collectionName];
				collection.forEach(async (accidence) =>
					accidence.initialize ? await accidence.initialize() : null
				);
				size += collection.size;
			}
			return size;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`Initialize accidence error:\n${error}`
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
	 * Import the accidence from file
	 * @since 0.0.1
	 * @param {*} directory Directory of file
	 * @param {*} filePath Path of file
	 * @returns Imported library accidence or undefined if error
	 */
	async _importAccidenceFile(directory, filePath) {
		try {
			const Accidence = await import(join("file:///", filePath));
			if (!BaseLibrary._isClass(Accidence.default)) {
				this.inquirer.logger.fatal(
					this.title,
					`Class is not exported or exported without default`
				);
			}

			const accidence = new Accidence.default(this.inquirer);
			if (!accidence.name)
				return this.inquirer.logger.fatal(
					this.title,
					"Accidence is no instanceof by base class"
				);

			accidence.library = this;
			accidence.baseName = directory.baseName;

			const base = this.modules[accidence.baseName];
			if (!BaseLibrary._isClass(base)) {
				this.inquirer.logger.fatal(
					this.title,
					`Base class is not a class. Please check the option 'multiBase'`
				);
			}
			if (!(accidence instanceof base)) {
				this.inquirer.logger.fatal(
					this.title,
					`Accidence is no instanceof by base class`
				);
			}
			return accidence;
		} catch (error) {
			this.inquirer.logger.fatal(
				`${filePath}:\nAccidence doesn't imported: ${error}`
			);
			return undefined;
		}
	}

	/**
	 * Set accidence to collection
	 * @since 0.0.1
	 * @param {*} accidence The accidence to set
	 * @returns Boolean value
	 */
	_setAccidence(accidence) {
		try {
			let collection = this[accidence.baseName];
			collection.set(accidence.name, accidence);
			return true;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`Collection '${accidence.baseName}' is not found: ${error}`
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
