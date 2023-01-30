import { BaseModule } from "../../../utils/base/BaseModule.js";

/**
 * Base hear class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseHear extends BaseModule {
	constructor(inquirer, depends, parameters = {}) {
		super(
			inquirer,
			{
				depends,
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
						id: "targets",
						type: Array,
						required: true,
						unique: true,
					},
					{
						id: "hidden",
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
	 * Initialize the hear
	 * @since 0.0.1
	 * @returns Current hear class
	 */
	prepare() {
		if (!this.inquirer.constants.telegrafHears) return this;
		const _execute = async function (ctx) {
			const hear = this.inquirer.listeners.get(this.name);
			const isOwner =
				ctx.user.isOwner && this.inquirer.constants.owners.useHiddenPieces;
			if (hear && (!hear.hidden || (hear.hidden && isOwner)))
				await this["execute"](ctx);
			else return false;
		};
		this.inquirer["hears"](
			this.targets,
			this.stable ? this["execute"] : _execute.bind(this)
		);
		return this;
	}
}
