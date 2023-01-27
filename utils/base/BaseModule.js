/**
 * Base module
 * @since 0.0.1
 */
export class BaseModule {
	#default;
	#parameters;

	constructor(inquirer, options, parameters) {
		this.#default = inquirer.constants.pieceDefault;
		this.#parameters = parameters;
		this.inquirer = inquirer;

		for (const option of options) {
			Object.defineProperty(this, option.id, {
				get() {
					return this._setOptionParameter(option);
				},
				writable: false,
				configurable: false,
				enumerable: false,
			});
		}

		if (this.executor) {
			if (!this.run)
				throw new Error(
					`Module '${this.name}' must be have a method 'run'`
				);
			if (this.run.constructor.name !== "AsyncFunction")
				throw new Error(
					`Method 'run' of module '${this.name}' must be an AsyncFunction`
				);
		}
		this.run = this.run.bind(this);
		this.execute = this.executor ? this.execute.bind(this) : undefined;
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
	 * Safely method "init"
	 * @since 0.0.1
	 */
	async initialize() {
		try {
			if (!this.controller)
				this.inquirer.logger.error(
					this.title,
					`Piece '${this.name}' doesn't have a controller`
				);
			await this.init();
		} catch (error) {
			this.controller.emit("init_error", error);
		}
	}

	/**
	 * Get parameter of option
	 * @since 0.0.1
	 * @param {*} option The option of parameter
	 * @returns parameter or undefined
	 */
	_setOptionParameter(option) {
		const parameter = this.#parameters[option.id];
		if (!option.required && !parameter)
			return option.default ? option.default : this.#default[option.id];
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
				`Type of parameter '${option.name}' must be '${option.type.name}'`
			);
		return parameter;
	}

	_addOptionParameter(id, value) {
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
