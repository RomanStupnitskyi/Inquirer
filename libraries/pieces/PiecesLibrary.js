import { BaseLibrary } from "../../utils/base/BaseLibrary.js";
import { BaseCommand as command } from "./base/BaseCommand.js";
import { BaseHear as hear } from "./base/BaseHear.js";

/**
 * Library of pieces class
 * @since 0.0.1
 * @extends BaseLibrary
 */
export class PiecesLibrary extends BaseLibrary {
	constructor(inquirer) {
		super(inquirer, {
			name: "pieces",
			modules: { command, hear },
		});
	}
}
