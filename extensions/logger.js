/**
 * Logger class
 * @since 0.0.1
 */
export class Logger {
	/**
	 * @param {*} inquirer Inquirer bot client
	 * @param {*} options Some options for EventEmitter
	 */
	constructor(inquirer, parameters = { title: "" }) {
		this._config = inquirer.constants.logger;
		this._parameters = parameters;
	}

	get title() {
		return this._parameters.title ?? "";
	}

	/**
	 * Set logger title
	 * @param {*} title The title
	 * @returns The title
	 */
	_setTitle(title = "") {
		this._parameters.title = title;
		return title;
	}

	_log(logType, ...messages) {
		if (!this[logType])
			throw new TypeError(
				'Unresolved type of colors. Please choose something between "debug", "error" and "warning".'
			);

		const { date, type, title, message } = this._config[logType];
		const localeDate = new Date().toLocaleString();

		const dateLog = this._config.showDate ? date(`${localeDate}`) : "";
		const typeLog = this._config.showType
			? type(`[${logType.toUpperCase()}]`)
			: "";
		const titleLog = title(`(${this.title}):`);
		const prefixLog = [dateLog, typeLog, titleLog]
			.filter((i) => !!i)
			.join(" ");

		const messageLog =
			prefixLog +
			" " +
			messages
				.map((m) => {
					if (typeof m === "object") m = m.stack ?? m;
					return message(
						!m.split ? m : m.split("\n").join(`\n${prefixLog} `)
					);
				})
				.join(`\n${prefixLog} `);
		return console.log(messageLog);
	}

	debug(...messages) {
		return this._log("debug", ...messages);
	}

	complete(...messages) {
		return this._log("complete", ...messages);
	}

	warn(...messages) {
		return this._log("warn", ...messages);
	}

	error(...messages) {
		return this._log("error", ...messages);
	}

	fatal(...messages) {
		this._log("fatal", ...messages);
		return process.exit();
	}
}
