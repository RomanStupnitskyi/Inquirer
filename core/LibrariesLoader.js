import { BaseLibrary } from "./structures/BaseLibrary.js";
import { Collection } from "../extensions/Collection.js";
import { Logger } from "../extensions/Logger.js";
import { join, basename } from "path";
import { scan } from "fs-nextra";

/**
 * Load libraries class
 * @since 0.0.1
 */
export class LibrariesAutoLoader extends Collection {
	/**
	 * @param {*} inquirer Inquirer bot client
	 */
	constructor(inquirer, values = []) {
		super(values);
		this.inquirer = inquirer;
		this.cache = new Collection();
		Object.defineProperty(this, "_logger", {
			value: new Logger(inquirer, { title: `library:${this.name}` }),
			writable: true,
			enumerable: true,
			configurable: false,
		});
	}

	/**
	 * Load the project libraries
	 */
	async loadLibraries() {
		try {
			this._logger.debug("Loading libraries...");

			const librariesRoot = this.inquirer.constants.paths.libraries;
			const librariesDirectories = await this._getLibrariesDirectories(
				librariesRoot
			);

			for (const pathToLibrary of librariesDirectories) {
				const Library = await this._importLibraryClass(pathToLibrary);
				const name = basename(pathToLibrary);
				this.cache.set(name, { class: Library, path: pathToLibrary });

				this._logger.debug(`Successfully loaded '${Library.name}' library`);
			}

			this._logger.debug(
				`Successfully loaded ${this.cache.size} libraries\nLibraries loading is complete`
			);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Initialize the loaded libraries
	 */
	async initializeLibraries() {
		try {
			this._logger.debug("Initializing libraries...");

			for (const [name, Library] of this.cache.entries()) {
				const library = new Library.class(this.inquirer, {
					name,
					path: Library.path,
				});
				await library.loadManagers();

				const size = await library.initializeManagers();
				this.inquirer[name] = library;
				this.set(name, library);

				this._logger.debug(
					`Successfully initialized library '${name}': ${library.size} managers, ${size} modules`
				);
			}

			this._logger.debug(
				`Successfully initialized ${this.size} libraries\nLibraries initializing is complete`
			);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Get the libraries folders
	 * @param {*} path The path to libraries
	 * @returns Array with libraries paths
	 */
	async _getLibrariesDirectories(path) {
		const directories = await scan(path, {
			filter: (stat) => stat.isDirectory(),
			depthLimit: 0,
		});
		return directories.keys();
	}

	/**
	 * Get the library main file
	 * @param {*} path Path to currently library
	 * @returns Paths to libraries
	 */
	async _getLibraryFile(path) {
		const files = (
			await scan(path, {
				filter: (state) => state.isFile() && state.name.endsWith(".js"),
				depthLimit: -1,
			})
		).keys();
		return [...files][0];
	}

	/**
	 * Import library class
	 * @param {*} libraryFolder Library directory
	 * @returns Library class
	 */
	async _importLibraryClass(libraryPath) {
		const libraryFilePath = await this._getLibraryFile(libraryPath);
		const libraryFile = await import(join("file:///", libraryFilePath));
		const Library = Object.values(libraryFile).find(
			(i) => this._isClass(i) && Object.getPrototypeOf(i) === BaseLibrary
		);
		if (!Library)
			throw new Error(`${libraryFilePath}: Library is not defined`);
		return Library;
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
