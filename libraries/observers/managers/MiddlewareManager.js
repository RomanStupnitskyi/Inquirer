import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseMiddleware } from "../base/BaseMiddleware.js";

/**
 * Middlewares manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class MiddlewaresManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "middlewares",
			module: { name: "middleware", base: BaseMiddleware },
			...properties,
		});
	}

	_prepareModules() {
		for (const middleware of this.inquirer.constants.middlewares) {
			this.inquirer.use(middleware);
		}
	}
}
