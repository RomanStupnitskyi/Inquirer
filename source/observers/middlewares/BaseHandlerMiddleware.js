import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";
import { User } from "../../../extensions/context/User.js";

/**
 * Middleware class to handle basical data
 * @since 0.0.1
 * @extends Middleware
 */
export default class BaseHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "baseHandler",
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
		ctx.inquirer = this.inquirer;
		ctx.user = new User(ctx);
		//await ctx.user.initialize();
		next();
	}
}
