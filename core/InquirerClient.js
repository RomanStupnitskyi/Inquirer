import { Telegraf } from "telegraf";
import { Logger } from "../utils/logger.js";
import { MySQL } from "./database/MySQL.js";

import constants from "../utils/constants.js";

import { ControllersHandler } from "./ControllersHandler.js";
import { ComponentsLibrary } from "../libraries/components/ComponentsLibrary.js";
import { ServicesLibrary } from "../libraries/services/ServicesLibrary.js";
import { PiecesLibrary } from "../libraries/pieces/PiecesLibrary.js";

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

		this.controllers = new ControllersHandler(this);
		this.components = new ComponentsLibrary(this);
		this.pieces = new PiecesLibrary(this);
		this.services = new ServicesLibrary(this);
	}

	/**
	 * Load all libraries
	 * @since 0.0.1
	 */
	async _loadLibraries() {
		await this.services.loadLibrary();
		await this.components.loadLibrary();
		await this.pieces.loadLibrary();
	}

	/**
	 * Initialize libraries
	 * @since 0.0.1
	 * @returns Libraries collections size
	 */
	async _initLibraries() {
		const services = await this.services.initializeLibrary();
		const components = await this.components.initializeLibrary();
		const pieces = await this.pieces.initializeLibrary();

		return { services, components, pieces };
	}

	/**
	 * Handle all project parts
	 * @since 0.0.1
	 * @returns Telegram bot client 'Inquirer'
	 */
	async _handle() {
		await this.controllers.loadControllers();
		const controllers = await this.controllers.initializeControllers();

		await this._loadLibraries();
		const libs = await this._initLibraries();
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
