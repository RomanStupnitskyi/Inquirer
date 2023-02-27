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

	async _run(next) {
		if (!this.inquirer.constants.telegrafButtons) return next();
		console.log(!!this.callbackQuery);
		next();
	}
}
