import { Telegraf } from "telegraf";
import { Logger } from "../extensions/logger.js";
import { MySQL } from "./database/MySQL.js";

import constants from "../constants.js";
import { LibrariesLoader } from "./LibrariesLoader.js";
import { ControllersHandler } from "./controllers/ControllersHandler.js";

/**
 * Telegram bot client 'Inquirer'
 * @since 0.0.1
 * @extends Telegraf
 */
export class InquirerClient extends Telegraf {
	constructor(token = constants.token) {
		super(token);
		this.constants = Object.freeze(constants);
		this.logger = new Logger();
		this.mysql = new MySQL(this);

		this.librariesLoader = new LibrariesLoader(this);
		this.controllers = new ControllersHandler(this);
	}

	/**
	 * Handle all project parts
	 * @since 0.0.1
	 * @returns Telegram bot client 'Inquirer'
	 */
	async _handle() {
		await this.controllers.loadControllers();
		const controllers = await this.controllers.initializeControllers();

		await this.librariesLoader.loadLibraries();
		const libs = await this.librariesLoader.initializeLibraries();
		this.controller.emit("handle_log", { controllers, ...libs });
		await this.mysql.connect();
		await this.mysql.loadTables();
		return this;
	}

	/**
	 * Start Telegram bot client 'Inquirer'
	 * @since 0.0.1
	 * @returns Telegram bot client 'Inquirer'
	 */
	async start() {
		await this._handle();
		await this.launch();

		return this;
	}
}
