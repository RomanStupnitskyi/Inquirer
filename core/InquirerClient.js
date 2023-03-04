import { Telegraf } from "telegraf";

import { MySQL } from "./database/MySQL.js";
import constants from "../constants.js";
import { LibrariesAutoLoader } from "./LibrariesLoader.js";

/**
 * Inquirer bot client
 * @since 0.0.1
 * @extends Telegraf
 */
export class InquirerClient extends Telegraf {
	constructor(token = constants.token) {
		super(token);
		this.constants = Object.freeze(constants);

		this.mysql = new MySQL(this);
		this.libraries = new LibrariesAutoLoader(this);
	}

	/**
	 * Handle all project parts
	 */
	async _handle() {
		await this.libraries.loadLibraries();
		await this.libraries.initializeLibraries();

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
