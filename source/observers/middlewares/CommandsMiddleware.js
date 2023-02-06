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
		next();
	}
}
