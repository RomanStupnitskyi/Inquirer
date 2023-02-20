import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Base package service
 * @since 0.0.1
 * @extends BaseModule
 */
export class BasePackageService extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [],
			optionsArguments,
			...properties,
		});
	}
}
