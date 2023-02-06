/**
 * Base module class
 * @since 0.0.1
 */
export class BaseModule {
	constructor(inquirer, parameters, values) {
		this.inquirer = inquirer;
		this.parameters = parameters;

		// Register and handle options
		for (const option of parameters.options) {
			Object.defineProperty(this, option.id, {
				value: this._handleOptionValue(option, values),
				configurable: false,
				enumerable: false,
			});
		}

		// Check module executor
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
		this.run = this.parameters.config.useExecutor
			? this.run.bind(this)
			: undefined;
		this.execute = this.parameters.config.useExecutor
			? this.execute.bind(this)
			: undefined;
	}

	/**
	 * The module title
	 * @since 0.0.1
	 */
	get title() {
		return `${this.library.name}:${this.baseName}`;
	}

	/**
	 * Module base name
	 * @since 0.0.1
	 */
	get baseName() {
		return this.default.baseName;
	}

	/**
	 * Module is dependent of some objects
	 * @since 0.0.1
	 */
	get dependent() {
		return this.parameters.config.dependent || false;
	}

	/**
	 * Module must have the executor
	 * @since 0.0.1
	 */
	get useExecutor() {
		return this.parameters.config.useExecutor || false;
	}

	/**
	 * Module executor
	 * @since 0.0.1
	 * @param  {...any} args Some args to run module
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
	initialize() {
		try {
			// Load module controller
			if (!this.Controller) return this.destroy("controller is not exists");
			this.controller = new this.Controller(this.inquirer, {
				production: true,
				module: this,
			});

			// Handle required objects
			if (this.dependent) {
				const depends = this.parameters.config.dependentValues;
				if (!depends) this.controller.emit("dependent_error");
				if (!(typeof depends !== "object"))
					this.controller.emit("dependent_type_error");
				if (depends[Symbol.iterator])
					this.controller.emit("dependent_iterator_error");

				for (const [key, value] in depends)
					Object.defineProperty(this, key, {
						value,
						writable: false,
						configurable: false,
						enumerable: false,
					});
			}
			if (this.prepare) this.prepare();
		} catch (error) {
			this.controller.emit("init_error", error);
		}
	}

	/**
	 * Handle option's value
	 * @since 0.0.1
	 * @param {*} option The option
	 * @returns value or undefined
	 */
	_handleOptionValue(option, values) {
		const parameter = values[option.id];
		if (!option.required && !parameter)
			return option.default ? option.default : this.default[option.id];
		if (option.required && !parameter)
			this.inquirer.logger.fatal(
				this.title,
				`Module must be have the parameter '${option}'`
			);
		const has = this.library[this.directory.storeName].hasByValue({
			[option.id]: parameter,
		});
		if (option.unique && has)
			this.inquirer.logger.fatal(
				this.title,
				`In module '${this.name}' value of parameter '${option.id}' already exists in another module. The value of parameter '${parameter}' must be unique.`
			);
		if (option.type && parameter.__proto__.constructor !== option.type)
			this.inquirer.logger.fatal(
				this.title,
				`Type of parameter '${option.id}' must be '${option.type.name}'`
			);
		return parameter;
	}

	/**
	 * Add new option with a value
	 * @since 0.0.1
	 * @param {*} id Option identifier
	 * @param {*} value The option's value
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

	destroy(reason = "Unknown reason") {
		this.library[this.baseName].delete(this.name);
		this.inquirer.logger.warn(this.title, `Module destroyed: ${reason}`);
		delete this;
	}
}
