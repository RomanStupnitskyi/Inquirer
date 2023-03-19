import { BaseMiddleware } from "../../../stores/observers/middlewares/MiddlewaresManager.js";

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
			const button = this.inquirer.components.buttons.modules.get(
				(module) => {
					const labels = [];
					if (module.label) labels.push(module.label);
					if (module.byLanguageKey)
						labels.push(
							...this.inquirer.components.languages.getAllReplics(
								module.name
							)
						);
					if (
						labels.includes(this.message.text) &&
						(module.byLanguageKey
							? this.user.language.hasLocalReplica(this.message.text)
							: true)
					)
						return true;
					return false;
				}
			);
			if (!button) return next();
			this.piece = button;
			return await button["execute"](this);
		}
		if (this.inquirer.constants.telegrafButtons) return next();

		const callback_query = this.callback_query ?? this.update.callback_query;
		const buttonName = callback_query.data;
		const button = this.inquirer.components.buttons.getModule(buttonName);
		if (button) {
			this.piece = button;
			return await button["execute"](this);
		}
		next();
	}
}
