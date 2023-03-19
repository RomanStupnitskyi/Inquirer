import { join, basename } from "path";
import { scan } from "fs-nextra";

import { BaseStore } from "./structures/BaseStore.js";
import { Collection } from "../extensions/Collection.js";
import { Logger } from "../extensions/Logger.js";

/**
 * Stores auto loader class
 * @since 0.0.1
 */
export class StoresAutoLoader extends Collection {
	constructor(inquirer, values = []) {
		super(values);
		this.inquirer = inquirer;
		this.cache = new Collection();

		Object.defineProperty(this, "_logger", {
			value: new Logger(inquirer, { title: `StoresLoader` }),
			writable: false,
			enumerable: false,
			configurable: false,
		});
	}

	/**
	 * Load the project stores
	 */
	async loadStores() {
		try {
			this._logger.debug("Loading stores...");

			const storesRootPath = this.inquirer.constants.paths.stores;
			const storesDirectories = await this._getStoresDirectories(
				storesRootPath
			);

			for (const pathToStore of storesDirectories) {
				const Store = await this._importStoreClass(pathToStore);
				const name = basename(pathToStore);
				this.cache.set(name, { Store, path: pathToStore });

				this._logger.debug(`Successfully loaded '${Store.name}' store`);
			}

			this._logger.complete(
				`Successfully loaded ${this.cache.size} stores`,
				"Loading stores is complete"
			);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Initialize the loaded stores
	 */
	async initializeStores() {
		try {
			this._logger.debug("Initializing stores...");

			for (const [name, { Store, path }] of this.cache.entries()) {
				const store = new Store(this.inquirer, {
					name,
					path,
				});
				await store.loadManagers();
				const size = await store.initializeManagers();

				this.inquirer[name] = store;
				this.set(name, store);

				this._logger.debug(
					`Successfully initialized store '${name}': ${store.size} managers, ${size} modules`
				);
			}

			this._logger.complete(
				`Successfully initialized ${this.size} stores`,
				"Stores initialization is complete"
			);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Get stores folders
	 * @param {*} path Path to stores
	 * @returns Array with stores paths
	 */
	async _getStoresDirectories(path) {
		const directories = await scan(path, {
			filter: (stat) => stat.isDirectory(),
			depthLimit: 0,
		});
		return directories.keys();
	}

	/**
	 * Get store main file
	 * @param {*} path Path to currently store
	 * @returns Paths to each store
	 */
	async _getStoreFile(path) {
		const files = (
			await scan(path, {
				filter: (state) => state.isFile() && state.name.endsWith(".js"),
				depthLimit: -1,
			})
		).keys();
		return [...files][0];
	}

	/**
	 * Import store class
	 * @param {*} storePath Path to store file
	 * @returns Store class
	 */
	async _importStoreClass(storePath) {
		const pathToStoreFile = await this._getStoreFile(storePath);
		const storeFile = await import(join("file:///", pathToStoreFile));
		const Store = Object.values(storeFile).find(
			(i) => this._isClass(i) && Object.getPrototypeOf(i) === BaseStore
		);
		if (!Store) throw new Error(`${pathToStoreFile}: Store is not defined`);
		return Store;
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
