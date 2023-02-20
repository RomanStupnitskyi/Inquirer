import { BaseLibrary } from "../../core/structures/BaseLibrary.js";

/**
 * Library of observers class
 * @since 0.0.1
 * @extends BaseLibrary
 */
export class ObserversLibrary extends BaseLibrary {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "observers",
			...properties,
		});
	}
}
