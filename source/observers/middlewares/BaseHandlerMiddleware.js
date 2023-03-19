import { BaseMiddleware } from "../../../stores/observers/middlewares/MiddlewaresManager.js";
import { WaitResponce } from "../../../extensions/context/WaitResponce.js";

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
		if (!this.message && !this.update.callback_query) return;
		if (this.session.waitResponce instanceof WaitResponce) {
			const waitResponce = this.session.waitResponce;
			if (waitResponce.waitFor === "text") {
				const message = this.message;
				return message.text
					? await waitResponce.piece["execute"](message.text)
					: null;
			}
			if (waitResponce.waitFor === "button") {
				const buttonName = this.update.callback_query.data;
				return await waitResponce.piece["execute"](buttonName);
			}
		}
		next();
	}
}
