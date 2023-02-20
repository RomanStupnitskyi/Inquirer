import { Telegraf } from "telegraf";

import { MySQL } from "./database/MySQL.js";
import constants from "../constants.js";
import { LibrariesLoader } from "./LibrariesLoader.js";

/**
 * Telegram bot client 'Inquirer'
 * @since 0.0.1
 * @extends Telegraf
 */
export class InquirerClient extends Telegraf {
	/**
	 * @param {*} token The telegram bot token
	 */
	constructor(token = constants.token) {
		super(token);
		this.constants = Object.freeze(constants);

		this.mysql = new MySQL(this);
		this._librariesLoader = new LibrariesLoader(this);
	}

	/**
	 * Handle all project parts
	 */
	async _handle() {
		await this._librariesLoader.loadLibraries();
		await this._librariesLoader.initializeLibraries();

		await this.mysql.connect();
		await this.mysql.loadTables();
		await this.mysql.initializeTables();
		return this;
	}

	/**
	 * Start Inquirer bot client
	 */
	async start() {
		await this._handle();
		await this.launch();
	}
}
