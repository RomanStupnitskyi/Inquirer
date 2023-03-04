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
					id: "buttons",
					type: Array,
					default: [],
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

	get keyboard() {
		const buttons = [];
		const back = this.inquirer.components
			.getManager("buttons")
			.modules.get("back");
		for (const line of this.buttons) {
			for (const buttonName of line) {
				const button = this.inquirer.components
					.getManager("buttons")
					.modules.get(buttonName);
				if (!button) {
					this._logger.error(
						this.name,
						`Button '${buttonName}' is not defined`
					);
					continue;
				}

				const index = this.buttons.indexOf(line);
				if (!buttons[index]) buttons.push([]);
				buttons[index].push([button.text, button.name]);
			}
		}

		if (this.name !== "menu") buttons.push([back]);
		return buttons;
	}
}
