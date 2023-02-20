import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseListener } from "../base/BaseListener.js";

/**
 * Listeners manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class ListenersManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "listeners",
			module: { name: "listener", base: BaseListener },
			...properties,
		});
	}
}
