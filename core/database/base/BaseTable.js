import { Logger } from "../../../extensions/Logger.js";

/**
 * Table base class
 * @since 0.0.1
 */
export class BaseTable {
	constructor(inquirer, connection, options) {
		this.inquirer = inquirer;
		this.connection = connection;

		this._options = options;
		this._config = this.inquirer.constants.database;

		this._logger = new Logger(inquirer, {
			title: `mysql:${this.name}`,
		});
	}

	/**
	 * The table name
	 */
	get name() {
		const name = this._options.name;
		if (!name)
			this._logger.fatal(
				"Option 'name' is not exists: the option is requied"
			);
		return name;
	}

	/**
	 * The table statement
	 */
	get statement() {
		const statement = this._options.statement;
		if (!statement)
			this._logger.fatal(
				"Option 'statement' is not exists: the option is required"
			);

		return Object.entries(statement)
			.map(([key, parameters]) => {
				let { type, count } = parameters;
				type = type.toUpperCase();

				if (
					this._config.countableTypes.includes(type) &&
					!count &&
					!["number", "string", "boolean"].includes(typeof count)
				)
					this._logger.fatal(
						`Type '${type}' is countable: option 'count' is not exists`
					);

				const optionDefault = parameters.default
					? `DEFAULT ${
							typeof parameters.default === "string"
								? `'${parameters.default}'`
								: parameters.default
					  }`
					: "";
				return `${key} ${type}${
					count ? `(${count})` : ""
				} ${optionDefault}`;
			})
			.join(",");
	}

	/**
	 * Initialize table
	 */
	async initialize() {
		try {
			this._logger.debug("Initializing...");

			await this.connection.query(
				`CREATE TABLE IF NOT EXISTS ${this.name} (${this.statement})`
			);

			this._logger.debug("Initialization is complete");
		} catch (error) {
			this._logger.fatal(
				`An error occurred while initializing table`,
				error
			);
		}
	}

	/**
	 * Create table record
	 * @param {*} options The creation options
	 * @returns Created record
	 */
	async create(options = {}) {
		try {
			const where = Object.entries(options)
				.map(([key, value]) => `${key}=${value}`)
				.join(" AND ");
			const keys = Object.keys(options).join(",");
			const values = Object.values(options).join(",");
			await this.connection.query(
				`INSERT INTO ${this.name} (${keys}) VALUES (${values})`
			);
			return await this.connection.query(
				`SELECT * FROM ${this.name} WHERE ${where}`
			);
		} catch (error) {
			this._logger.error(
				`An error occurred while creating table element`,
				error
			);
			return false;
		}
	}

	/**
	 * Update table record
	 * @param {*} where Record options signs
	 * @param {*} options Record update options
	 * @returns Updated record
	 */
	async update(where = {}, options = {}) {
		try {
			where = Object.entries(where)
				.map(([key, value]) => `${key} = ${value}`)
				.join(" AND ");
			options = Object.entries(options)
				.map(
					([key, value]) =>
						`${key} = ${typeof value === "string" ? `'${value}'` : value}`
				)
				.join(",");
			await this.connection.query(
				`UPDATE ${this.name} SET ${options} WHERE ${where}`
			);
			const record = await this.connection.query(
				`SELECT * FROM ${this.name} WHERE ${where}`
			);
			return record[0];
		} catch (error) {
			this._logger.error(
				`An error occurred while updating table element`,
				error
			);
			return false;
		}
	}

	/**
	 * Get table record
	 * @param {*} where Record options signs
	 * @param {*} createIfNull Create record if undefined
	 * @returns Found record
	 */
	async get(where = {}, createIfNull = false) {
		try {
			const options = Object.entries(where)
				.map(([key, value]) => `${key} = ${value}`)
				.join(" AND ");
			let record = await this.connection.query(
				`SELECT * FROM ${this.name} WHERE ${options}`
			);
			if (record[0].length === 0 && createIfNull)
				record = await this.create(where);
			return record[0];
		} catch (error) {
			this._logger.error(
				`An error occurred while getting table element`,
				error
			);
			return undefined;
		}
	}
}
