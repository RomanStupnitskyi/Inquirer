import { BaseModule } from "../../../core/structures/BaseModule.js";
import { Context } from "telegraf";

/**
 * Base listener class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseListener extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			options: [
				{
					id: "cooldown",
					type: Object,
					default: {
						count: 0,
						duration: 0,
					},
				},
				{
					id: "once",
					type: Boolean,
					default: false,
				},
			],
			optionsArguments,
			...properties,
		});
	}

	_prepare() {
		const _execute = async function (ctx, ...args) {
			if (ctx instanceof Context) ctx.inquirer = this.inquirer;
			const listenerArguments =
				ctx instanceof Context ? [ctx, args] : [this, args];
			const listener = this.inquirer.observers.cache
				.get(this._properties.manager.name)
				.cache.get(this.name);
			if (listener) await listener["execute"](...listenerArguments);
			else return false;
		};
		const type = this.once ? "once" : "on";
		this.inquirer[type](this.name, _execute.bind(this));
		return this;
	}
}
