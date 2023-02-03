import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";

/**
 * Middleware class to handle commands
 * @since 0.0.1
 * @extends Middleware
 */
export default class CommandsHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "commandsHandler",
				stable: true,
			},
			config
		);
	}

	/**
	 * Run method
	 * @param {*} ctx Message context
	 * @param {*} next Function to execute next contextHandlers
	 * @returns null
	 */
	async run(ctx, next) {
		if (!ctx.message || !ctx.message.text) return next();
		const args = ctx.message.text.split(" ");
		const commandName = args.shift();
		if (!commandName.startsWith("/")) return next();

		const command = this.inquirer.pieces.commands.get(
			commandName.replace(/\//g, "").toLowerCase()
		);
		const isOwner =
			ctx.user.isOwner && this.inquirer.constants.owners.useHiddenPieces;
		if (!command || (command.hidden && !isOwner)) {
			return await ctx.reply("🪨 Command is not defined");
		}
		ctx["command"] = command;
		return await command.execute(ctx, ...args);
	}
}
