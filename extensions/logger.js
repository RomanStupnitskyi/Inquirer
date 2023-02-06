import chalk from "chalk";

export class Logger {
	get debugConfig() {
		return {
			prefix: chalk.gray,
			title: chalk.bgCyan.bold,
			name: chalk.cyan,
			message: chalk.white,
		};
	}

	get warnConfig() {
		return {
			prefix: chalk.gray,
			title: chalk.bgHex("#DEC11E").bold,
			name: chalk.hex("#DEC11E"),
			message: chalk.white,
		};
	}

	get errorConfig() {
		return {
			prefix: chalk.gray,
			title: chalk.bgRed,
			name: chalk.red,
			message: chalk.red,
		};
	}

	get fatalConfig() {
		return {
			prefix: chalk.gray,
			title: chalk.bgRed,
			name: chalk.red,
			message: chalk.red,
		};
	}

	log(options, from, ...messages) {
		if (!this[options.type])
			throw new TypeError(
				'Unresolved type of colors. Please choose something between "debug", "error" and "warning".'
			);

		const { prefix, title, name, message } = options;
		const date = new Date().toLocaleString();

		const dateString = prefix(`[${date}]`);
		const titleString = title(`${options.type.toUpperCase()}`);
		const nameString = name(`(${from}):`);
		const prefixText = `${dateString} ${titleString} ${nameString} `;
		const messageString =
			prefixText +
			messages
				.map((m) =>
					message(!m.split ? m : m.split("\n").join(`\n${prefixText}`))
				)
				.join(`\n${prefixText}`);
		return console.log(`${messageString}`);
	}

	debug(from, ...messages) {
		const options = Object.assign({ type: "debug" }, this.debugConfig);
		return this.log(options, from, ...messages);
	}

	warn(from, ...messages) {
		const options = Object.assign({ type: "warn" }, this.warnConfig);
		return this.log(options, from, ...messages);
	}

	error(from, ...messages) {
		const options = Object.assign({ type: "error" }, this.errorConfig);
		return this.log(options, from, ...messages);
	}

	fatal(from, ...messages) {
		const options = Object.assign({ type: "fatal" }, this.fatalConfig);
		this.log(options, from, ...messages);
		return process.exit();
	}
}
