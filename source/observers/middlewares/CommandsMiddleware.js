import { BaseMiddleware } from "../../../libraries/observers/middlewares/MiddlewaresManager.js";

export default class CommandsHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "commandsHandler",
				stable: true,
			},
			properties
		);
	}

	async _run(next) {
		if (!this.message || !this.message.text) return next();

		let commandName = this.message.text.split(" ").shift();
		if (!commandName.startsWith("/")) return next();
		commandName = commandName.replace(/\//, "");

		this.command = this.inquirer.pieces
			.getManager("commands")
			.getModule(commandName);
		if (this.command) return await this.command.execute(this);

		next();
	}
}
