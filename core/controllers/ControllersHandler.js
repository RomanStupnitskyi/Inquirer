import { Store } from "../structures/Store.js";
import { basename, join } from "node:path";
import { scan, pathExists, mkdirs } from "fs-nextra";
import { BaseController } from "../base/BaseController.js";

/**
 * The controllers handler class
 * @since 0.0.1
 */
export class ControllersHandler {
	/**
	 * @param {*} inquirer The inquirer client
	 */
	constructor(inquirer) {
		this.inquirer = inquirer;
		this.stores = [];
	}

	/**
	 * The class name
	 * @since 0.0.1
	 */
	get name() {
		return ControllersHandler.name;
	}

	/**
	 * Path to controllers
	 * @since 0.0.1
	 */
	get path() {
		return this.inquirer.constants.paths.controllers;
	}

	/**
	 * Load controllers
	 * @since 0.0.1
	 */
	async loadControllers() {
		try {
			const directories = await this._loadControllersDirectories();
			for (const directory of directories) {
				const controllersFilesPaths = await this._getControllersFiles(
					directory.path
				);
				for (const controllerFilePath of controllersFilesPaths) {
					const controller = await this._handleController(
						directory,
						controllerFilePath
					);
					this._addController(controller);
				}
			}
		} catch (error) {
			this.inquirer.logger.fatal(
				this.name,
				`An error occurred while loaded controllers: \n${error}`
			);
		}
	}

	/**
	 * Initialize controllers
	 * @returns Controllers size
	 */
	async initializeControllers() {
		let size = 0;
		try {
			for (const storeName of this.stores) {
				this[storeName].forEach((Controller) => {
					if (Controller.prototype._config.type === "target") {
						const controller = new Controller(this.inquirer);
						this[storeName].cache.set(controller.name, controller);
					}
				});
				size += this[storeName].size;
			}
			return size;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.name,
				`An error occurred while initialized controller:\n${error}`
			);
			return size;
		}
	}

	/**
	 * Load controllers directories
	 * @since 0.0.1
	 */
	async _loadControllersDirectories() {
		const folders = (
			await scan(this.path, {
				filter: (stat) => stat.isDirectory(),
			})
		).keys();

		const directories = [];
		for (const folder of folders) {
			const libraryName = basename(folder);
			this[libraryName] = new Store();
			this.stores.push(libraryName);
			directories.push({
				path: folder,
				libraryName,
			});
		}
		this.stores.sort((a, b) => (a > b ? -1 : 1));
		return directories;
	}

	/**
	 * Load controllers paths from directory path
	 * @since 0.0.1
	 * @param {*} path Directory path
	 * @returns Controllers paths
	 */
	async _getControllersFiles(path) {
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
	 * Import and handle controller
	 * @since 0.0.1
	 * @param {*} controllerFilePath Path to the controller
	 * @returns The controller class
	 */
	async _handleController(directory, controllerFilePath) {
		// Import controller by path
		const Controller = await import(join("file:///", controllerFilePath));

		// Check the controller class
		if (!Controller || !this._isClass(Controller.default))
			this.inquirer.logger.fatal(
				this.name,
				`Class is not exported or exported without default\n${filePath}`
			);
		if (Controller.default.__proto__ !== BaseController)
			this.inquirer.logger.fatal(
				this.name,
				"Controller is no instanceof by base class"
			);

		// Create controller instance
		const controller = new Controller.default(this.inquirer, {
			production: false,
		});

		Controller.default.prototype.directory = directory;
		Controller.default.prototype._config = {
			...controller.config,
			name: controller.name,
			type: controller.type,
		};

		return Controller.default;
	}

	/**
	 * Add controller to collection
	 * @since 0.0.1
	 * @param {*} controller The controller
	 * @returns Boolean value (true if successfully added else fatal error)
	 */
	_addController(controller) {
		try {
			const store = this[controller.prototype.directory.libraryName];
			store.set(controller.prototype._config.name, controller);
			return true;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.name,
				`An error occurred while added controller:\n${error}`
			);
		}
	}

	/**
	 * Check value is class
	 * @since 0.0.1
	 * @param {*} input Some value
	 * @returns Boolean
	 */
	_isClass(input) {
		return (
			typeof input === "function" &&
			typeof input.prototype === "object" &&
			input.toString().substring(0, 5) === "class"
		);
	}
}
