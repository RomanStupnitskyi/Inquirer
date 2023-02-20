import { BaseModule } from "../../../core/structures/BaseModule.js";

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
		const _execute = async function (...args) {
			const listener = this.inquirer.observers.listeners.cache.get(
				this.name
			);
			if (listener) await this["execute"](...args);
			else return false;
		};
		const type = this.once ? "once" : "on";
		this.inquirer[type](
			this.name,
			this.stable ? this["execute"] : _execute.bind(this)
		);
		return this;
	}
}
