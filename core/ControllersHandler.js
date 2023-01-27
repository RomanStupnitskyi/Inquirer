import { Collection } from "../utils/Collection.js";
import { basename, join } from "node:path";
import { scan, pathExists, mkdirs } from "fs-nextra";
import { BaseController } from "../utils/base/BaseController.js";

/**
 * Class to load and initialize controllers
 * @since 0.0.1
 */
export class ControllersHandler {
	constructor(inquirer) {
		this.inquirer = inquirer;
		this.collections = [];
	}

	get path() {
		return join(process.cwd(), "./core/controllers");
	}

	async loadControllers() {
		try {
			const folders = (
				await scan(this.path, {
					filter: (stat) => stat.isDirectory(),
				})
			).keys();
			for (const folderPath of folders) {
				const collectionName = basename(folderPath);
				this[collectionName] = new Collection();
				this.collections.push(collectionName);

				const files = await this._loadFiles(folderPath);
				for (const filePath of files) {
					const Controller = await import(join("file:///", filePath));
					if (
						!Controller ||
						!ControllersHandler._isClass(Controller.default)
					)
						return this.inquirer.logger.fatal(
							"controllers",
							`Class is not exported or exported without default\n${filePath}`
						);
					let controller = new Controller.default(this.inquirer);
					if (!(controller instanceof BaseController))
						return this.inquirer.logger.fatal(
							"controllers",
							"Controller is no instanceof by base class"
						);
					const identifier = controller.name;
					controller = controller.construction
						? controller
						: Controller.default;
					this[collectionName].set(identifier, controller);
				}
			}
		} catch (error) {
			this.inquirer.logger.fatal("controllers", error);
		}
	}

	async initializeControllers() {
		let size = 0;
		try {
			for (const collection of this.collections) {
				for (const [name, controller] of this[collection].entries()) {
					if (collection === "target")
						controller.target.controller = controller;
					else this.inquirer[collection].controllers.set(name, controller);
					if (controller.construction) controller.initialize();
				}
				size += this[collection].size;
			}
			return size;
		} catch (error) {
			this.inquirer.logger.fatal("controllers", error);
			return size;
		}
	}

	/**
	 * Load files paths from path
	 * @since 0.0.1
	 * @param {*} path Some path with files
	 * @returns Files paths
	 */
	async _loadFiles(path) {
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
