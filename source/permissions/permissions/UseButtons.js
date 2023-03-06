import { BasePermission } from "../../../libraries/permissions/permissions/PermissionsManager.js";

export class UseButtons extends BasePermission {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "use_buttons",
				description: "Permission to use buttons",
				byLanguageKey: true,
			},
			properties
		);
	}
}
