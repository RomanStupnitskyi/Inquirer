import { BaseMiddleware } from "../../../libraries/pieces/base/BaseMiddleware.js";

/**
 * Middleware class to handle basical data
 * @since 0.0.1
 * @extends Middleware
 */
export default class BaseHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer) {
		super(inquirer, {
			name: "basePermissions",
			stable: true,
		});
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
