import { Context } from "../../extensions/context/Context.js";
import { Logger } from "../../extensions/Logger.js";

/**
 * Base module class
 * @since 0.0.1
 */
export class BaseModule {
	constructor(inquirer, { options, optionsArguments, ...properties }) {
		this.inquirer = inquirer;

		Object.defineProperty(this, "_properties", {
			value: properties,
			writable: false,
			enumerable: false,
			configurable: false,
		});

		// Assign module options
		this._assignModuleOptions(options, optionsArguments);

		Object.defineProperty(this, "_logger", {
			value: new Logger(inquirer, {
				title: `${properties.manager.name}:${optionsArguments.name}`,
			}),
			writable: false,
			enumerable: false,
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
	 * The module base configuration
	 */
	get base() {
		return this._properties.base;
	}

	/**
	 * The module's manager
	 */
	get manager() {
		return this._properties.manager;
	}

	/**
	 * Module executor
	 * @param  {...any} args Some args to run module
	 */
	async execute(ctx, ...args) {
		try {
			let context = ctx;
			if (!Context.isContext(ctx)) {
				const { update, telegram, botInfo } = ctx;
				context = new Context(this.inquirer, update, telegram, botInfo);

				const contextProperties = Object.getOwnPropertyNames(context);
				const properties = Object.getOwnPropertyNames(ctx).filter(
					(property) => !contextProperties.includes(property)
				);

				for (const property of properties) {
					context[property] = ctx[property];
				}
				await context.apply();
			}
			if (this._properties.executeLog) {
				if (!this.log)
					this._logger.warn(
						"Cannot log execute calls: method 'log' is not exists"
					);
				else this.log(context, ...args);
			}
			const moduleThis = Context.isContext(context) ? context : this;
			await this._run.call(moduleThis, ...args);
		} catch (error) {
			this._logger.error("An error occurred while module calling", error);
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
				!["boolean", "number", "string"].includes(typeof option.default)
			)
				return null;
			return option.default;
		}

		if (option.required && !argument)
			throw new Error(
				`Option argument is not exists: the option '${option.id}' is required`
			);

		const has = this.manager.cache.hasByValue({
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
