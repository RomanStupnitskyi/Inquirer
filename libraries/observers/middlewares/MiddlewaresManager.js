import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Middlewares' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class MiddlewaresManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "middleware", baseclass: BaseMiddleware },
			...properties,
		});
	}

	_prepareModules() {
		for (const middleware of this.inquirer.constants.middlewares) {
			this.inquirer.use(middleware);
		}
	}
}

/**
 * Middleware base class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseMiddleware extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			options: [],
			optionsArguments,
			...properties,
		});
	}

	_prepare() {
		this.inquirer["use"](this.execute);
		return this;
	}
}
