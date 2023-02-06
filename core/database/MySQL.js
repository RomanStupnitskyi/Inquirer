import { createPool } from "mysql2/promise";
import { join } from "node:path";
import { scan, pathExists, mkdirs } from "fs-nextra";
import { BaseTable } from "./base/BaseTable.js";

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
		this.tables = [];
		this.#config = this.inquirer.constants.database;
	}

	/**
	 * Connect database
	 * @since 0.0.1
	 */
	async connect() {
		try {
			this["pool"] = createPool({
				host: this.#config.host,
				port: this.#config.port,
				user: this.#config.user,
				database: this.#config.name,
				password: this.#config.password,
			});
			this.controller.emit("connected");
		} catch (error) {
			this.controller.emit("connect_error", error);
		}
	}

	/**
	 * Load database tables
	 * @since 0.0.1
	 */
	async loadTables() {
		try {
			const tablesFilesPaths = await this._loadTablesPaths(
				this.inquirer.constants.paths.dbTables
			);
			for (const filePath of tablesFilesPaths) {
				const table = await this._handleTable(filePath);
				table["controller"] = this.controller;
				this.tables.push(table.name);
			}
		} catch (error) {
			this.controller.emit("load_tables_error", error);
		}
	}

	/**
	 * Load files paths from path
	 * @since 0.0.1
	 * @param {*} path Some path with files
	 * @returns Files paths
	 */
	async _loadTablesPaths(path) {
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

	async _handleTable(filePath) {
		const importFilePath = join("file:///", filePath);
		const Table = await import(importFilePath);
		if (!this._isClass(Table.default))
			this.controller.emit(
				"load_tables_error",
				`From file is no exported a class:\n${filePath}`
			);
		const table = new Table.default(this.inquirer, this.pool);
		if (!(table instanceof BaseTable))
			this.controller.emit(
				"load_tables_error",
				`Table class is no instanceof by base class:\n${filePath}`
			);
		return table;
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
