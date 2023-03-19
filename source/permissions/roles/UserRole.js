import { BaseRole } from "../../../stores/permissions/roles/RolesManager.js";

export class OwnerRole extends BaseRole {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "user",
				permissions: ["use_commands", "use_hears", "use_buttons"],
			},
			properties
		);
	}
}
