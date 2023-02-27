import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Base middleware class
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
		const _execute = async function (ctx, ...args) {
			ctx.inquirer = this.inquirer;
			const middleware = this.inquirer.observers.cache
				.get(this._properties.manager.name)
				.cache.get(this.name);
			if (middleware) await this["execute"](ctx, ...args);
			else return false;
		};
		this.inquirer["use"](_execute.bind(this));
		return this;
	}
}
