import { BaseLibrary } from "./structures/BaseLibrary.js";
import { Collection } from "../extensions/Collection.js";
import { Logger } from "../extensions/Logger.js";
import { basename, join } from "path";
import { scan } from "fs-nextra";

/**
 * Load libraries class
 * @since 0.0.1
 */
export class LibrariesLoader extends Collection {
	/**
	 * @param {*} inquirer Inquirer bot client
	 */
	constructor(inquirer, values = []) {
		super(values);
		this.inquirer = inquirer;
		this._logger = new Logger(inquirer, { title: "LibrariesLoader" });
	}

	/**
	 * Import the libraries and save to collection
	 */
	async loadLibraries() {
		try {
			this._logger.debug("Loading libraries...");

			const root = this.inquirer.constants.corePaths.libraries;
			const libraryPaths = await this._getLibrariesPaths(root);

			for (const libraryPath of libraryPaths) {
				const Library = await this._importLibraryClass(libraryPath);
				this.set(Library.name, { class: Library, path: libraryPath });

				this._logger.debug(`Successfully loaded '${Library.name}' library`);
			}

			this._logger.debug(
				`Libraries loading is complete\nSuccessfully loaded ${this.size} libraries`
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

			for (const [name, Library] of this.entries()) {
				const library = new Library.class(this.inquirer, {
					path: Library.path,
				});
				await library.loadManagers();

				const size = await library.initializeManagers();
				this.inquirer[name];

				this._logger.debug(
					`Successfully initialized library '${name}': ${library.size} managers, ${size} modules`
				);
			}

			this._logger.debug(`Libraries initializing is complete`);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Get the libraries folders
	 * @param {*} path The path to libraries
	 * @returns Array with paths
	 */
	async _getLibrariesPaths(path) {
		const folders = (
			await scan(path, {
				filter: (stat) => stat.isDirectory(),
				depthLimit: 0,
			})
		).keys();

		const paths = [];
		for (const path of folders) {
			paths.push(path);
		}
		return paths;
	}

	/**
	 * Get the library main file
	 * @param {*} path Path to currently library
	 * @returns The file path
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
