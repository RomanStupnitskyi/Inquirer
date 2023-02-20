import { BaseLibrary } from "../../core/structures/BaseLibrary.js";

/**
 * The components class
 * @since 0.0.1
 */
export class ComponentsLibrary extends BaseLibrary {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "components",
			...properties,
		});
	}

	getLanguage(ctx) {
		return this["languages"].get(ctx.user.language);
	}
}
