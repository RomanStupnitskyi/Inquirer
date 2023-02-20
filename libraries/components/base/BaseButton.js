import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Base button class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseButton extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			options: [],
			optionsArguments,
			...properties,
		});
	}
}
