import { Logger } from "../../extensions/Logger.js";

/**
 * Base module class
 * @since 0.0.1
 */
export class BaseModule {
	/**
	 * @param {*} inquirer Inquirer bot client
	 * @param {*} param1 Module parameters
	 */
	constructor(inquirer, { options, optionsArguments, ...properties }) {
		this.inquirer = inquirer;
		this._properties = properties;

		// Assign module options
		this._assignModuleOptions(options, optionsArguments);
		Object.defineProperty(this, "_logger", {
			value: new Logger(inquirer, {
				title: `${properties.manager.name}:${this.name}`,
			}),
			enumerable: true,
			configurable: false,
		});

		// Check module executor
		if (this._properties.useExecutor) {
			if (!this._run) this._logger.fatal(`Method '_run' is not exists`);
			if (this._run.constructor.name !== "AsyncFunction")
				this._logger.fatal(`Method '_run' must be an AsyncFunction`);
		}
		this.execute = this._properties.useExecutor
			? this.execute.bind(this)
			: undefined;
	}

	/**
	 * The module title
	 */
	get title() {
		return `${this._properties.module.name}:${this.name}`;
	}

	/**
	 * Module executor
	 * @param  {...any} args Some args to run module
	 */
	async execute(moduleThis, ...args) {
		try {
			if (this.useExecutor && this.executeLog) {
				if (!this.log)
					this._logger.warn(
						"Cannot log execute calls: method 'log' is not exists"
					);
				else this.log(...args);
			}
			await this._run.call(moduleThis, ...args);
		} catch (error) {
			this._logger.error("An error occurred while module calling", error);
		}
	}

	/**
	 * Initialize the module
	 */
	initialize() {
		try {
			this._logger.debug("Initializing...");
			if (this._prepare) this._prepare(this);
			this._logger.debug(`Initializing is complete`);
		} catch (error) {
			this._logger.error(
				"An error occurred while module initializing",
				error
			);
		}
	}

	/**
	 * Assign module options
	 * @param {*} options The module options
	 * @param {*} optionsArguments The options arguments
	 */
	_assignModuleOptions(options, optionsArguments) {
		// Assign default options
		const moduleDefaultOptions = this.inquirer.constants.moduleDefaultOptions;
		for (const option of moduleDefaultOptions) {
			Object.defineProperty(this, option.id, {
				value: this._assignModuleOption(
					option,
					optionsArguments[option.id]
				),
				writable: false,
				configurable: false,
			});
		}

		// Assign module options
		for (const option of options) {
			const isExists = moduleDefaultOptions.find((i) => i.id === option.id);
			if (isExists)
				throw new Error(
					`Option with id '${option.id}' already exists in default options`
				);

			Object.defineProperty(this, option.id, {
				value: this._assignModuleOption(
					option,
					optionsArguments[option.id]
				),
				writable: false,
				configurable: false,
			});
		}
	}

	/**
	 * Handle option's value
	 * @param {*} option The option
	 * @returns value or undefined
	 */
	_assignModuleOption(option, argument) {
		if (!option.required && !argument) {
			if (
				!option.default &&
				!["boolean", "number"].includes(typeof option.default)
			)
				throw new Error(
					`Option '${option.id}' must be have default argument`
				);
			return option.default;
		}
		if (option.required && !argument)
			throw new Error(
				`Option argument is not exists: the option '${option.id}' is required`
			);
		const has = this._properties.manager.cache.hasByValue({
			[option.id]: argument,
		});
		if (option.unique && has)
			throw new Error(
				`Option '${option.id}' argument '${argument}' already exists in another module.`
			);
		if (
			option.type &&
			Object.getPrototypeOf(argument).constructor !== option.type
		)
			throw new Error(
				`Type of argument '${option.id}' must be '${option.type.name}'`
			);
		return argument;
	}
}
