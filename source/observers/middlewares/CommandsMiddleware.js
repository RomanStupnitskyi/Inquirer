import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";

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

	async run(ctx, next) {
		if (!ctx.message || !ctx.message.text) return next();
		next();
	}
}
