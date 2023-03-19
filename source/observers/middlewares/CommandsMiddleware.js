import { BaseMiddleware } from "../../../stores/observers/middlewares/MiddlewaresManager.js";

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

		const command = this.inquirer.pieces.commands.getModule(commandName);
		if (command) {
			this.piece = command;
			return await command["execute"](this);
		} else if (this.message.text.startsWith("/"))
			return await this.replyWithReplica("commandNotFound");

		next();
	}
}
