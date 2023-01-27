export class BaseTable {
	#options;
	#default;

	constructor(inquirer, pool, options) {
		this.inquirer = inquirer;
		this.pool = pool;
		this.#options = options;
		this.#default = this.inquirer.constants.tableDefault;
	}

	get name() {
		const name = this.#options.name;
		if (!name) throw new Error(`Table must be have the option 'name'`);
		return name;
	}

	get statement() {
		const statement = this.#options.statement || this.#default.statement;
		return Object.entries(statement)
			.map(([key, value]) => `${key} ${value}`)
			.join(",\n");
	}

	async init() {
		try {
			await this.pool.query(
				`CREATE TABLE IF NOT EXISTS ${this.name} (${this.statement})`
			);
			this.controller.emit("table_init", this.name);
		} catch (error) {
			this.controller.emit("table_init_error", error);
		}
	}

	async create(options = {}) {
		try {
			const where = Object.entries(options)
				.map(([key, value]) => `${key}=${value}`)
				.join(" AND ");
			const keys = Object.keys(options).join(",");
			const values = Object.values(options).join(",");
			await this.pool.query(
				`INSERT INTO ${this.name} (${keys}) VALUES (${values})`
			);
			return await this.pool.query(
				`SELECT * FROM ${this.name} WHERE ${where}`
			);
		} catch (error) {
			this.controller.emit("table_error", error);
			return false;
		}
	}

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
			await this.pool.query(
				`UPDATE ${this.name} SET ${options} WHERE ${where}`
			);
			const record = await this.pool.query(
				`SELECT * FROM ${this.name} WHERE ${where}`
			);
			return record[0];
		} catch (error) {
			this.controller.emit("table_error", error);
			return false;
		}
	}

	async get(where = {}, createIfNull = false) {
		try {
			const options = Object.entries(where)
				.map(([key, value]) => `${key} = ${value}`)
				.join(" AND ");
			let record = await this.pool.query(
				`SELECT * FROM ${this.name} WHERE ${options}`
			);
			if (record[0].length === 0 && createIfNull)
				record = await this.create(where);
			return record[0];
		} catch (error) {
			this.controller.emit("table_error", error);
			return undefined;
		}
	}
}
