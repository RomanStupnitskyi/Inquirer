import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";

/**
 * Middleware class to handle hears
 * @since 0.0.1
 * @extends Middleware
 */
export default class HearsHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "buttonsHandler",
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
