import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";

export default class HearsHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "buttonsHandler",
			},
			properties
		);
	}

	async run(ctx, next) {
		if (!ctx.message || !ctx.message.text) return next();
		next();
	}
}
