import { Telegraf } from "telegraf";
import { MySQL } from "./database/MySQL.js";
import constants from "../constants.js";
import { StoresAutoLoader } from "./StoresAutoLoader.js";

/**
 * Inquirer bot client
 * @extends Telegraf
 * @since 0.0.1
 */
export class InquirerClient extends Telegraf {
	/**
	 * Creates an instance of InquirerClient.
	 * @constructor
	 * @param {string} [token=constants.token] The Telegram Bot API token
	 */
	constructor(token = constants.token) {
		super(token);
		this.constants = Object.freeze(constants);
		this.mysql = new MySQL(this);
		this.stores = new StoresAutoLoader(this);
	}

	/**
	 * Handles all project parts
	 * @private
	 * @returns {Promise<InquirerClient>} The current instance of the InquirerClient
	 */
	async _handle() {
		await this.stores.loadStores();
		await this.stores.initializeStores();
		await this.mysql.connect();
		await this.mysql.loadTables();
		await this.mysql.initializeTables();
		return this;
	}

	/**
	 * Starts the Inquirer bot client
	 * @returns {Promise<void>}
	 */
	async start() {
		await this._handle();
		await this.launch();
	}
}
