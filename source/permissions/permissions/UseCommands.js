import { BasePermission } from "../../../stores/permissions/permissions/PermissionsManager.js";

export class UseCommands extends BasePermission {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "use_commands",
				description: "Permission to use commands",
				byLanguageKey: true,
			},
			properties
		);
	}
}
