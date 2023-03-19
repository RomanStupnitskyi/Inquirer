import { BaseStore } from "../../core/structures/BaseStore.js";

/**
 * Permissions store class
 * @extends BaseStore
 */
export class PermissionsStore extends BaseStore {
	constructor(inquirer, properties = {}) {
		super(inquirer, properties);
	}
}
