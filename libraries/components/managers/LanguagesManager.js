import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseLanguage } from "../base/BaseLanguage.js";

/**
 * Languages manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class LanguagesManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "languages",
			module: { name: "language", base: BaseLanguage },
			...properties,
		});
	}
}
