import { BaseMiddleware } from "../../../libraries/observers/middlewares/MiddlewaresManager.js";

export default class ButtonsHandlerMiddleware extends BaseMiddleware {
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
		if (this.message) {
			const button = this.inquirer.components
				.getManager("buttons")
				.modules.find((module) => {
					const labels = module.byLanguageKey
						? [
								...module.labels,
								...this.inquirer.components
									.getManager("languages")
									.getAllReplics(module.name),
						  ]
						: module.labels;
					if (labels.includes(this.message.text)) return true;
					return false;
				});
			if (!button || !button.useHear) return next();
			return await button["execute"](this);
		}
		if (this.inquirer.constants.telegrafButtons) return next();
		next();
	}
}
