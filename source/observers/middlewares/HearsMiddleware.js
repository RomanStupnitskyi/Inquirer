import { BaseMiddleware } from "../../../libraries/observers/middlewares/MiddlewaresManager.js";

export default class HearsHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "hearsHandler",
			},
			properties
		);
	}

	async _run(next) {
		const hear = this.inquirer.pieces
			.getManager("hears")
			.getModule((module) => {
				return module.labels.includes(this.message.text);
			});
		if (hear) return await hear["execute"](this);
		next();
	}
}
