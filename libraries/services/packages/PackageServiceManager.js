import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Node package services' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class PackageServiceManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "package", baseclass: BasePackageService },
			...properties,
		});
	}
}

/**
 * Package service base class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BasePackageService extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [
				{
					id: "package",
					type: Object,
					unique: true,
					required: true,
				},
			],
			optionsArguments,
			...properties,
		});
	}
}
