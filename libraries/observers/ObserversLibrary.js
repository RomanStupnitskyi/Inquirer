import { BaseLibrary } from "../../utils/base/BaseLibrary.js";
import { BaseListener as listeners } from "../observers/base/BaseListener.js";
import { BaseMiddleware as middlewares } from "../observers/base/BaseMiddleware.js";

/**
 * Library of observers class
 * @since 0.0.1
 * @extends BaseLibrary
 */
export class ObserversLibrary extends BaseLibrary {
	constructor(inquirer) {
		super(inquirer, {
			name: "observers",
			modules: { listeners, middlewares },
		});
	}

	/**
	 * Initialize default middlewares
	 * @returns Current class
	 */
	async _prepareModules() {
		for (const middleware of this.inquirer.constants.middlewares) {
			this.inquirer.use(middleware);
		}
		return this;
	}
}
