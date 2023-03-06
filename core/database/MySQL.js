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

	constructor(inquirer) {
		this.inquirer = inquirer;
		this.#config = this.inquirer.constants.database;

		this.tables = new Collection();
		this.cache = new Collection();
		Object.defineProperty(this, "_logger", {
			value: new Logger(inquirer, { title: "mysql" }),
			writable: false,
			enumerable: false,
			configurable: false,
		});
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
			this._logger.complete("Database connection is complete");
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

			const tablesFilesPaths = await this._loadPathsToTables(
				this.inquirer.constants.paths.dbTables
			);
			for (const filePath of tablesFilesPaths) {
				const Table = await this._importTableClass(filePath);
				this.tables.set(Table.name, Table);
			}

			this._logger.complete(
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

			this._logger.complete(
				`Successfully initialized ${this.cache.size} tables\nDatabase tables intitialization is complete`
			);
		} catch (error) {
			this._logger.fatal(
				"An error occurred while intitializing tables",
				error
			);
		}
	}

	/**
	 * Load paths to tables
	 * @param {*} path Some path with files
	 * @returns Files paths
	 */
	async _loadPathsToTables(path) {
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
		return files.keys();
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
			(module) =>
				this._isClass(module) && Object.getPrototypeOf(module) === BaseTable
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
