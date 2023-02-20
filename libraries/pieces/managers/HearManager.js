import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseHear } from "../base/BaseHear.js";

/**
 * Hears manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class HearsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "hears",
			module: { name: "hear", base: BaseHear },
			...properties,
		});
	}
}
