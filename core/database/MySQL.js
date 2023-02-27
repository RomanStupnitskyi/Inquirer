import { createConnection } from "mysql2/promise";
import { join } from "node:path";
import { scan, pathExists, mkdirs } from "fs-nextra";

import { Logger } from "../../extensions/Logger.js";
import { BaseTable } from "./base/BaseTable.js";
import { Collection } from "../../extensions/Collection.js";

/**
 * Database class MySQL
 * @since 0.0.1
 */
export class MySQL {
	#config;

	/**
	 * @param {*} inquirer The inquirer client
	 */
	constructor(inquirer) {
		this.inquirer = inquirer;
		this.#config = this.inquirer.constants.database;

		this.tables = new Collection();
		this.cache = new Collection();
		this._logger = new Logger(inquirer, { title: "mysql" });
	}

	/**
	 * Connect database
	 */
	async connect() {
		try {
			this._logger.debug("Connecting to database...");
			this["connection"] = await createConnection({
				host: this.#config.host,
				port: this.#config.port,
				user: this.#config.user,
				database: this.#config.name,
				password: this.#config.password,
			});
			this._logger.debug("Database connect is complete");
		} catch (error) {
			this._logger.fatal(
				"An error occurred while database was connecting",
				error
			);
		}
	}

	/**
	 * Load database tables
	 */
	async loadTables() {
		try {
			this._logger.debug("Loading tables...");

			const tablesFilesPaths = await this._loadTablesPaths(
				this.inquirer.constants.paths.dbTables
			);
			for (const filePath of tablesFilesPaths) {
				const Table = await this._importTableClass(filePath);
				this.tables.set(Table.name, Table);
			}

			this._logger.debug(
				`Successfully loaded ${this.tables.size} tables\nTables loading is complete`
			);
		} catch (error) {
			this._logger.fatal("An error occurred while table loading", error);
		}
	}

	/**
	 * Initialize database tables
	 */
	async initializeTables() {
		try {
			this._logger.debug("Initializing database tables...");

			for (const Table of this.tables.values()) {
				const table = new Table(this.inquirer, this.connection);
				await table.initialize();
				this[table.name] = table;
				this.cache.set(table.name, table);
			}

			this._logger.debug(
				`Successfully initialized ${this.cache.size} tables\nDatabase tables intitializing is complete`
			);
		} catch (error) {
			this._logger.fatal(
				"An error occurred while intitializing tables",
				error
			);
		}
	}

	/**
	 * Load files paths from path
	 * @param {*} path Some path with files
	 * @returns Files paths
	 */
	async _loadTablesPaths(path) {
		const folderExists = await pathExists(path);
		const folderEnsure = this.inquirer.constants.folderEnsure;
		if (!folderExists) {
			if (!folderEnsure) throw new Error(`Path is not exists '${path}'`);
			await mkdirs(path);
			return [];
		}
		const files = await scan(path, {
			filter: (stat) => stat.isFile() && stat.name.endsWith(".js"),
		});
		return (await Promise.all([...files])).map((i) => i[0]);
	}

	/**
	 * Import table class by path
	 * @param {*} filePath Path to table
	 * @returns The table class
	 */
	async _importTableClass(filePath) {
		const importFilePath = join("file:///", filePath);
		const tableFile = await import(importFilePath);
		const Table = Object.values(tableFile).find(
			(i) => this._isClass(i) && Object.getPrototypeOf(i) === BaseTable
		);

		if (!Table)
			this._logger.fatal(
				`${filePath} Table is not class or is not instance of by base class`
			);
		return Table;
	}

	/**
	 * Check value is class
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
