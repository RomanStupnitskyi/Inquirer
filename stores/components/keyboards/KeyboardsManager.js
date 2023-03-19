import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Keyboards' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class KeyboardsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "keyboard", baseclass: BaseKeyboard },
			...properties,
		});
	}
}

/**
 * Keyboard base class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseKeyboard extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [
				{
					id: "rows",
					type: Array,
					default: [],
				},
				{
					id: "main",
					type: Boolean,
					default: false,
				},
				{
					id: "resize_keyboard",
					type: Boolean,
					default: true,
				},
			],
			optionsArguments,
			...properties,
		});
	}

	initialize() {
		for (const row of this.rows) {
			for (const buttonName of row) {
				const button = this.manager.store.buttons.getModule(buttonName);
				if (!button) {
					this.rows[this.rows.indexOf(row)].splice(row.indexOf(button), 1);
					this._logger.warn(`Button '${buttonName}' is not exists`);
					continue;
				}
			}
		}
	}

	keyboard(context) {
		const buttons = [];
		for (const line of this.rows) {
			for (const buttonName of line) {
				const button = this.manager.store.buttons.getModule(buttonName);
				if (!button) {
					this._logger.error(
						this.name,
						`Button '${buttonName}' is not defined`
					);
					continue;
				}

				const index = this.rows.indexOf(line);
				if (!buttons[index]) buttons.push([]);

				const label = button.byLanguageKey
					? context.user.language.getLocalReplica(button.name) ||
					  button.label
					: button.label;
				if (button.fixed) {
					this._logger.warn(
						`You cannot add fixed button '${button.name}' to keyboard`
					);
					continue;
				}
				buttons[index].push(label ? label : button.name);
			}
		}

		// Add fixed buttons
		//const fixedButtons = this.inquirer.components
		//	.getManager("buttons")
		//	.modules.filter((fixedButton) => fixedButton.fixed);

		//if (fixedButtons.size > 0)
		//	buttons.push([
		//		fixedButtons.toArray().map((fixedButton) => {
		//			const label = fixedButton.byLanguageKey
		//				? context.user.language.getLocalReplica(fixedButton.name) ||
		//				  fixedButton.label
		//				: fixedButton.label;
		//			return label ? label : fixedButton.name;
		//		})
		//	]);

		return {
			reply_markup: {
				keyboard: buttons,
				resize_keyboard: this.resize_keyboard,
			},
		};
	}

	inlineKeyboard(context) {
		const buttons = [];
		for (const line of this.rows) {
			for (const buttonName of line) {
				const button =
					this.inquirer.components.buttons.getModule(buttonName);
				if (!button) {
					this._logger.error(
						this.name,
						`Button '${buttonName}' is not defined`
					);
					continue;
				}

				const index = this.rows.indexOf(line);
				if (!buttons[index]) buttons.push([]);

				const label = button.byLanguageKey
					? context.user.language.getLocalReplica(button.name) ||
					  button.label
					: button.label;
				if (!label && !button.label) {
					this._logger.warn(`Button ${button.name} doesn't have labels`);
					continue;
				}
				buttons[index].push({ text: label, callback_data: button.name });
			}
		}

		//if (this.showFixedButtons) {
		//	// Add fixed buttons
		//	const fixedButtons = this.inquirer.components
		//		.getManager("buttons")
		//		.modules.filter((fixedButton) => fixedButton.fixed);

		//	if (fixedButtons.size > 0)
		//		buttons.push([
		//			fixedButtons.toArray().map((fixedButton) => {
		//				const label = fixedButton.byLanguageKey
		//					? context.user.language.getLocalReplica(
		//							fixedButton.name
		//					  ) || fixedButton.label
		//					: fixedButton.label;
		//				return {
		//					text: label ? label : fixedButton.name,
		//					callback_data: fixedButton.name,
		//				};
		//			}),
		//		]);
		//}

		return {
			reply_markup: {
				inline_keyboard: buttons,
			},
		};
	}
}
