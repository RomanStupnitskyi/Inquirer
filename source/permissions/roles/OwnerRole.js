import { BaseRole } from "../../../stores/permissions/roles/RolesManager.js";

export class OwnerRole extends BaseRole {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "owner",
				permissions: [],
			},
			properties
		);
	}
}
