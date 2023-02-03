import EventEmitter from "node:events";

/**
 * Base class of controllers
 * @since 0.0.1
 * @extends EventEmitter
 */
export class BaseController extends EventEmitter {
	#default;
	#parameters;
	#module;

	constructor(inquirer, parameters = {}, module, options = {}) {
		super(options);
		this.inquirer = inquirer;
		this.#default = inquirer.constants.defaultParameters.controllers;
		this.#parameters = parameters;
		this.#module = module ? module : undefined;

		this.initialize();
	}

	/**
	 * Identifier of controller
	 * @since 0.0.1
	 */
	get name() {
		return this.#parameters.name || this.#default.name;
	}

	/**
	 * Controller title
	 * @since 0.0.1
	 */
	get title() {
		return this.#module ? `${this.name}:${this.#module.name}` : this.name;
	}

	/**
	 * Target that will be controlled
	 * @since 0.0.1
	 */
	get target() {
		if (!this.#parameters.target)
			this.inquirer.logger.fatal(
				this.title,
				"Controller must be have the target"
			);
		return this.#parameters.target;
	}

	/**
	 * Controller emitters to init them
	 * @since 0.0.1
	 */
	get emitters() {
		return this.#parameters.emitters;
	}

	get construction() {
		if (typeof this.#parameters.construction === "boolean")
			return this.#parameters.construction;
		return this.#default.construction;
	}

	/**
	 * Initialize the controller
	 * @since 0.0.1
	 */
	initialize() {
		try {
			for (const emitter of this.emitters) {
				this.on(emitter, this[emitter]);
			}
			if (this.type === "target") this.target["controller"] = this;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`An error occurred while initializing the controller "${this.name}":\n${error}`
			);
		}
	}

	/**
	 * Log some message
	 * @since 0.0.1
	 * @param  {...any} message The message texts to log
	 * @returns null
	 */
	info(...message) {
		this.inquirer.logger.debug(this.title, ...message);
	}

	/**
	 * Log error while loading modules
	 * @since 0.0.1
	 * @param  {...any} message Some error text
	 * @returns null
	 */
	load_error(...message) {
		this.inquirer.logger.error(
			this.title,
			`An error occurred while loading: ${message.join(" ")}`
		);
	}

	/**
	 * Log error while initializing module
	 * @since 0.0.1
	 * @param  {...any} message Error message to log
	 * @returns null
	 */
	init_error(...message) {
		this.inquirer.logger.error(
			this.title,
			`An error occurred while initializing: ${message.join(" ")}`
		);
	}

	/**
	 * Log the error while module exeuting
	 * @since 0.0.1
	 * @param  {...any} messages Error message to log
	 * @returns null
	 */
	run_error(...message) {
		this.inquirer.logger.error(
			this.title,
			`An error occurred while module called: ${message.join(" ")}`
		);
	}
}
