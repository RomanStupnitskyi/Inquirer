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
	 * Initialize hear
	 * @since 0.0.1
	 * @returns Current hear class
	 */
	_prepare() {
		if (!this.inquirer.constants.telegrafHears) return this;
		const _execute = async function (ctx, ...args) {
			ctx.inquirer = this.inquirer;
			const hear = this.inquirer.pieces.cache
				.get(this._properties.manager.name)
				.cache.get(this.name);
			const isOwner =
				ctx.user.isOwner && this.inquirer.constants.owners.useHiddenPieces;
			if (hear && (!hear.hidden || (hear.hidden && isOwner)))
				await this["execute"](ctx, ...args);
			else return false;
		};
		this.inquirer["hears"](this.targets, _execute.bind(this));
		return this;
	}
}
