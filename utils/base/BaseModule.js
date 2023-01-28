/**
 * Base module
 * @since 0.0.1
 */
export class BaseModule {
	#values;

	constructor(inquirer, { config, options }, values) {
		this.inquirer = inquirer;

		this.#values = values;
		this.#config = config;

		for (const option of options) {
			Object.defineProperty(this, option.id, {
				get() {
					return this._handleOptionValue(option);
				},
				writable: false,
				configurable: false,
				enumerable: false,
			});
		}

		if (this.useExecutor) {
			if (!this.run)
				throw new Error(
					`Module '${this.name}' must be have a method 'run'`
				);
			if (this.run.constructor.name !== "AsyncFunction")
				throw new Error(
					`Method 'run' of module '${this.name}' must be an AsyncFunction`
				);
		}
		this.run = this.useExecutor ? this.run.bind(this) : undefined;
		this.execute = this.useExecutor ? this.execute.bind(this) : undefined;
	}

	get dependent() {
		return config.dependent || false;
	}

	get useExecutor() {
		return config.useExecutor || false;
	}

	/**
	 * Safely method "run"
	 * @since 0.0.1
	 * @param  {...any} args Some args to run piece
	 */
	async execute(...args) {
		try {
			if (["listeners", "commands", "hears"].includes(this.baseName))
				this.controller.emit("log", ...args);
			await this.run(...args);
		} catch (error) {
			this.controller.emit("run_error", error);
		}
	}

	/**
	 * Initialize the module
	 * @since 0.0.1
	 */
	async initialize() {
		try {
			const Controller = this.library.controllers.get(this.baseName);
			if (Controller)
				this.controller = new Controller(this.inquirer, accidence);
			if (!this.controller)
				this.inquirer.logger.error(
					this.title,
					`Module '${this.name}' doesn't have a controller`
				);
			await this.init();
		} catch (error) {
			this.controller.emit("init_error", error);
		}
	}

	/**
	 * Get option value
	 * @since 0.0.1
	 * @param {*} option The option of parameter
	 * @returns parameter or undefined
	 */
	_handleOptionValue(option) {
		const parameter = this.#values[option.id];
		if (!option.required && !parameter)
			return option.default ? option.default : null;
		if (option.required && !parameter)
			throw new Error(`Module must be have the parameter '${option}'`);

		const has = this.inquirer[this.library.name][this.baseName].hasByValue({
			[option.id]: parameter,
		});
		if (option.unique && has)
			throw new Error(
				`In module '${this.name}' value of parameter '${option}' already exists in another module. The value of parameter '${parameter}' must be unique.`
			);
		if (option.type && parameter.__proto__.constructor !== option.type)
			throw new Error(
				`Type of parameter '${option.id}' must be '${option.type.name}'`
			);
		return parameter;
	}

	/**
	 * Add new option with value
	 * @since 0.0.1
	 * @param {*} id Option identifier
	 * @param {*} value The parameter
	 */
	_addOption(id, value) {
		if (this[id]) this.controller.fatal("option_already_exists", id);
		if (!value) this.controller.fatal("value_not_specified", id);
		Object.defineProperty(this, id, {
			get() {
				return value;
			},
			writable: false,
			configurable: false,
			enumerable: false,
		});
	}
}
