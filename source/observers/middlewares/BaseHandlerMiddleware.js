import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";
import { User } from "../../../extensions/context/User.js";

export default class BaseHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "baseHandler",
				stable: true,
			},
			properties
		);
	}

	async run(ctx, next) {
		ctx.inquirer = this.inquirer;
		ctx.user = new User(ctx);
		//await ctx.user.initialize();
		next();
	}
}
