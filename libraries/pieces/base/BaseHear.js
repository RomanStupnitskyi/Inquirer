import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Base hear class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseHear extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			options: [
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
			],
			optionsArguments,
			...properties,
		});
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
