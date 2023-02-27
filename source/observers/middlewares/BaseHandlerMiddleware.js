import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";
import { User } from "../../../extensions/context/User.js";

export default class BaseHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "baseHandler",
			},
			properties
		);
	}

	async _run(next) {
		this.keyboards = this.inquirer.components.cache.get("keyboards");
		this.user = new User(this);
		await this.user.initialize();
		next();
	}
}
