import { BaseModule } from "../../../utils/base/BaseModule.js";

/**
 * Base listener class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseListener extends BaseModule {
	constructor(inquirer, parameters = {}) {
		super(
			inquirer,
			{
				config: {
					dependent: true,
					useExecutor: true,
				},
				options: [
					{
						id: "name",
						type: String,
						required: true,
						unique: true,
					},
					{
						id: "cooldown",
						type: Object,
					},
					{
						id: "once",
						type: Boolean,
						default: false,
					},
					{
						id: "stable",
						type: Boolean,
						default: false,
					},
				],
			},
			parameters
		);
	}

	/**
	 * Initialize the listener
	 * @since 0.0.1
	 * @returns Current listener class
	 */
	prepare() {
		const _execute = async function (...args) {
			const listener = this.inquirer.listeners.get(this.name);
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
