import { BaseLibrary } from "../../core/structures/BaseLibrary.js";

/**
 * Library of services class
 * @since 0.0.1
 * @extends BaseLibrary
 */
export class ServicesLibrary extends BaseLibrary {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "services",
			...properties,
		});
	}
}
