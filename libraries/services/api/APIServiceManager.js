import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * API services' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class APIServicesManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "api", baseclass: BaseAPIService },
			...properties,
		});
	}
}

/**
 * API service base class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseAPIService extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [
				{
					id: "url",
					type: String,
					required: true,
					unique: true,
				},
			],
			optionsArguments,
			...properties,
		});
	}
}
