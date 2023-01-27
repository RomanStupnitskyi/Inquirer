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
	constructor(inquirer) {
		this.inquirer = inquirer;
		this.#config = this.inquirer.constants.database;
	}

	/**
	 * Connect database
	 * @returns Telegram bot client "Inquirer"
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
			return this.inquirer;
		} catch (error) {
			this.controller.emit("connect_error", error);
			return this.inquirer;
		}
	}

	async loadTables() {
		try {
			const files = await this._loadFiles(
				this.inquirer.constants.paths.dbTables
			);
			for (const file of files) {
				const filePath = join("file:///", file);
				const Table = await import(filePath);
				if (!MySQL._isClass(Table.default))
					return this.controller.emit(
						"load_tables_error",
						`From file is no exported a class:\n${filePath}`
					);
				const table = new Table.default(this.inquirer, this.pool);
				if (!(table instanceof BaseTable))
					return this.controller.emit(
						"load_tables_error",
						`Table class is no instanceof by base class:\n${filePath}`
					);
				table["controller"] = this.controller;
				await table.init();
				this[table.name] = table;
			}
		} catch (error) {
			this.controller.emit("load_tables_error", error);
		}
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
}
