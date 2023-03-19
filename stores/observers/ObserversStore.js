import { BaseStore } from "../../core/structures/BaseStore.js";

/**
 * Observers store class
 * @since 0.0.1
 * @extends BaseStore
 */
export class ObserversStore extends BaseStore {
	constructor(inquirer, properties = {}) {
		super(inquirer, { sortManagers: true, ...properties });
	}
}
