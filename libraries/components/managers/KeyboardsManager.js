import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseKeyboard } from "../base/BaseKeyboard.js";

/**
 * Keyboards manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class KeyboardsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "keyboards",
			module: { name: "keyboard", base: BaseKeyboard },
			...properties,
		});
	}
}
