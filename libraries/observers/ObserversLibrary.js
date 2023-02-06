import { BaseLibrary } from "../../core/base/BaseLibrary.js";
import { BaseListener as listener } from "../observers/base/BaseListener.js";
import { BaseMiddleware as middleware } from "../observers/base/BaseMiddleware.js";

/**
 * Library of observers class
 * @since 0.0.1
 * @extends BaseLibrary
 */
export class ObserversLibrary extends BaseLibrary {
	constructor(inquirer) {
		super(inquirer, {
			name: "observers",
			modules: { listener, middleware },
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
