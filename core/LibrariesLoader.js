import { BaseLibrary } from "../core/base/BaseLibrary.js";
import { Collection } from "./structures/Collection.js";
import { basename, join } from "path";
import { scan } from "fs-nextra";

/**
 * Load libraries class
 * @since 0.0.1
 */
export class LibrariesLoader {
	constructor(inquirer) {
		this.inquirer = inquirer;
		this.libraries = new Collection();
	}

	/**
	 * Import the libraries and save to collection
	 * @since 0.0.1
	 */
	async loadLibraries() {
		try {
			const root = this.inquirer.constants.corePaths.libraries;
			const libraryFolders = await this._getLibraryFolders(root);

			for (const libraryFolder of libraryFolders) {
				const Library = await this._importLibraryFile(libraryFolder);
				await this._addLibrary(Library);
			}
		} catch (error) {
			this.controller.emit("load_error", error);
		}
	}

	/**
	 * Initialize the loaded libraries
	 * @since 0.0.1
	 */
	async initializeLibraries() {
		try {
			let result = {};
			for (const [name, library] of this.libraries.entries()) {
				this.inquirer[name] = library;
				await library.loadModules();
				const size = await library.initializeModules();
				result[name] = size;
			}
			return result;
		} catch (error) {
			this.controller.emit("init_error", error);
		}
	}

	/**
	 * Get the libraries folders
	 * @param {*} path The path to libraries
	 * @returns Array with paths
	 */
	async _getLibraryFolders(path) {
		const folders = (
			await scan(path, {
				filter: (stat) => stat.isDirectory(),
				depthLimit: 0,
			})
		).keys();

		const directories = [];
		for (const folder of folders) {
			const baseName = basename(folder);
			directories.push({ path: folder, baseName });
		}
		return directories;
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

	async _importLibraryFile(libraryFolder) {
		const libraryFilePath = await this._getLibraryFile(libraryFolder.path);
		const libraryFile = await import(join("file:///", libraryFilePath));
		const Library = Object.values(libraryFile).find(
			(i) => this._isClass(i) && i.__proto__.name === BaseLibrary.name
		);
		if (!Library)
			this.controller.emit("library_is_undefined", libraryFilePath);
		return Library;
	}

	async _addLibrary(Library) {
		const library = new Library(this.inquirer);
		this.libraries.set(library.name, library);
		return library;
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
