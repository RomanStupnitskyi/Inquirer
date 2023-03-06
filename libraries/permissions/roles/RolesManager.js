import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

export default class RolesManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "roles", baseclass: BaseRole },
			...properties,
		});
	}
}

export class BaseRole extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [
				{
					id: "permissions",
					type: Array,
					required: true,
				},
			],
			optionsArguments,
			...properties,
		});
	}

	_prepare() {
		for (const permission of this.permissions) {
			const isPermission = this.manager.library
				.getManager("permissions")
				.getModule(permission);
			if (!isPermission) {
				this.permissions.splice(this.permissions.indexOf(permission));
				this._logger.warn(`Permission '${permission}' is not exists`);
				continue;
			}
		}
	}
}
