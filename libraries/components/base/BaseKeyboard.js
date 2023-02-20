import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Base keyboard class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseKeyboard extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [
				{
					id: "buttons",
					type: Array,
					default: [],
				},
				{
					id: "resize_keyboard",
					type: Boolean,
					default: true,
				},
				{
					id: "hidden",
					type: Boolean,
					default: false,
				},
			],
			optionsArguments,
			...properties,
		});
	}

	/**
	 * Keyboard buttons
	 */
	get buttons() {
		const buttons = [];
		const back = this.inquirer.components.buttons.get("back");
		for (const line of this.buttons) {
			for (const buttonName of line) {
				const Handler = this.inquirer.components.buttons.get(buttonName);
				if (!Handler) {
					this.inquirer.logger.error(
						this.name,
						`Handler '${buttonName}' is not defined`
					);
					continue;
				}
				const handler = new Handler(this.inquirer, this.user);

				const index = this.buttons.indexOf(line);
				if (!buttons[index]) buttons.push([]);
				buttons[index].push([handler.text, handler.name]);
			}
		}

		if (this.name !== "menu") buttons.push([back]);
		return buttons;
	}

	/**
	 * Get keyboard reply markup
	 * @returns Keyboard reply markup
	 */
	keyboardReplyMarkup() {
		return {
			resize_keyboard: this.resize_keyboard,
			keyboard: this.buttons,
		};
	}
}
