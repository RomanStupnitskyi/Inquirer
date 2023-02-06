import EventEmitter from "node:events";

/**
 * Base controller class
 * @since 0.0.1
 * @extends EventEmitter
 */
export class BaseController extends EventEmitter {
	#default;

	/**
	 * @param {*} inquirer The inquirer client
	 * @param {*} parameters The controller parameters
	 * @param {*} config The development config
	 * @param {*} options The EventEmitter options
	 */
	constructor(
		inquirer,
		parameters = {},
		config = { production: true },
		options = {}
	) {
		super(options);
		this.inquirer = inquirer;
		this.config = config;

		this.#default = inquirer.constants.default.controllers;
		this.parameters = parameters;

		if (this.config.production) this._initialize();
	}

	/**
	 * The controller's name
	 * @since 0.0.1
	 */
	get name() {
		return this.parameters.name || this.#default.name;
	}

	/**
	 * The controller's title
	 * @since 0.0.1
	 */
	get title() {
		return this.module ? `${this.name}:${this.module.name}` : this.name;
	}

	/**
	 * The controller's type (module or target)
	 * @since 0.0.1
	 */
	get type() {
		if (
			this.parameters.type &&
			!["module", "target"].includes(this.parameters.type)
		)
			throw new Error(
				`Controller type '${this.parameters.type}' is not defined`
			);
		return this.parameters.type || this.#default.type;
	}

	/**
	 * The controller's target
	 * @since 0.0.1
	 */
	get target() {
		if (!this.parameters.target && this.type === "target")
			this.inquirer.logger.fatal(
				this.title,
				"Controller must be have a target"
			);
		return this.type === "target" ? this.parameters.target : undefined;
	}

	/**
	 * The controller's emitters
	 * @since 0.0.1
	 */
	get emitters() {
		return this.parameters.emitters;
	}

	/**
	 * The controller's module (if controller with type "module")
	 * @since 0.0.1
	 */
	get module() {
		if (
			this.type === "module" &&
			this.config.production &&
			!this.config.module
		)
			throw new Error(`Controller '${this.name}' must be have a module`);
		return this.type === "module" && this.config.production
			? this.config.module
			: undefined;
	}

	/**
	 * Initialize the controller
	 * @since 0.0.1
	 */
	_initialize() {
		try {
			for (const emitter of this.emitters) {
				this.on(emitter, this[emitter]);
			}
			if (this.type === "target") this.target["controller"] = this;
		} catch (error) {
			this.inquirer.logger.fatal(
				this.title,
				`An error occurred while initializing the controller:\n${error}`
			);
		}
	}

	/**
	 * Log some message
	 * @since 0.0.1
	 * @param  {...any} messagse The messages to log
	 * @returns null
	 */
	info(...messages) {
		this.inquirer.logger.debug(this.title, ...messages);
	}

	/**
	 * Log error while loading modules
	 * @since 0.0.1
	 * @param  {...any} messages Some error messages
	 * @returns null
	 */
	load_error(...messages) {
		this.inquirer.logger.error(
			this.title,
			"An error occurred while loading:",
			messages.join(" ")
		);
	}

	/**
	 * Log error while initializing module
	 * @since 0.0.1
	 * @param  {...any} messages Error messages to log
	 * @returns null
	 */
	init_error(...messages) {
		this.inquirer.logger.error(
			this.title,
			"An error occurred while initializing:",
			messages.join(" ")
		);
	}

	/**
	 * Log the error while module exeuting
	 * @since 0.0.1
	 * @param  {...any} messages Error messages to log
	 * @returns null
	 */
	run_error(...messages) {
		this.inquirer.logger.error(
			this.title,
			"An error occurred while module called:",
			messages.join(" ")
		);
	}
}
