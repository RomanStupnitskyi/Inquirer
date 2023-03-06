import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

export default class PermissionsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "permission", baseclass: BasePermission },
			...properties,
		});
	}

	ALL() {
		return [...this.modules.values()].map((permission) => permission.name);
	}
}

export class BasePermission extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [
				{
					id: "description",
					type: String,
					required: true,
					unique: true,
				},
				{
					id: "byLanguageKey",
					type: Boolean,
					default: false,
				},
			],
			optionsArguments,
			...properties,
		});
	}
}
