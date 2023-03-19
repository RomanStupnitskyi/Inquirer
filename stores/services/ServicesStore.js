import { BaseStore } from "../../core/structures/BaseStore.js";

/**
 * Services store class
 * @since 0.0.1
 * @extends BaseStore
 */
export class ServicesStore extends BaseStore {
	constructor(inquirer, properties = {}) {
		super(inquirer, properties);
	}
}
