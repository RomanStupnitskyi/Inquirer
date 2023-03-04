import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Hears' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class HearsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "hear", baseclass: BaseHear },
			...properties,
		});
	}
}

/**
 * Hear base class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseHear extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			options: [
				{
					id: "targets",
					type: Array,
					required: true,
					unique: true,
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

	_prepare() {
		if (this.inquirer.constants.telegrafHears)
			this.inquirer["hears"](this.targets, this.execute);
	}
}
