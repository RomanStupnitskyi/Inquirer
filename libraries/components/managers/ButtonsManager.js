import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseButton } from "../base/BaseButton.js";

/**
 * Buttons manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class ButtonsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "buttons",
			module: { name: "button", base: BaseButton },
			...properties,
		});
	}
}
