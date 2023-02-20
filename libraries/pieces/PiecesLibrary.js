import { BaseLibrary } from "../../core/structures/BaseLibrary.js";

/**
 * Library of pieces class
 * @since 0.0.1
 * @extends BaseLibrary
 */
export class PiecesLibrary extends BaseLibrary {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "pieces",
			...properties,
		});
	}
}
