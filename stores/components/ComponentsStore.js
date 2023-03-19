import { BaseStore } from "../../core/structures/BaseStore.js";

/**
 * The components store class
 * @since 0.0.1
 */
export class ComponentsStore extends BaseStore {
	constructor(inquirer, properties = {}) {
		super(inquirer, properties);
	}

	getLanguage(ctx) {
		return this.languages.getModule(ctx.user.language);
	}
}
