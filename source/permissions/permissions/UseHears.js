import { BasePermission } from "../../../stores/permissions/permissions/PermissionsManager.js";

export class UseHears extends BasePermission {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "use_hears",
				description: "Permission to use hears",
				byLanguageKey: true,
			},
			properties
		);
	}
}
