import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Base button class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseButton extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			options: [
				{
					id: "useHear",
					type: Boolean,
					default: false,
				},
				{
					id: "byLanguageKey",
					type: Boolean,
					default: false,
				},
				{
					id: "labels",
					type: Array,
					unique: true,
					default: [],
				},
			],
			optionsArguments,
			...properties,
		});
	}

	/**
	 * Initialize button
	 * @since 0.0.1
	 * @returns Current hear class
	 */
	_prepare() {
		const _execute = async function (ctx, ...args) {
			ctx.inquirer = this.inquirer;
			const button = this.inquirer.components.cache
				.get(this._properties.manager.name)
				.cache.get(this.name);
			const isOwner =
				ctx.user.isOwner && this.inquirer.constants.owners.useHiddenPieces;
			if (button && (!button.hidden || (button.hidden && isOwner)))
				await this["execute"](ctx, ...args);
			else return false;
		};
		if (this.useHear)
			this.inquirer["hears"](this.labels, _execute.bind(this));
		if (this.inquirer.constants.telegrafButtons) {
			const labels = this.byLanguageKey
				? [...this.lables, this.inquirer.languages.getAllReplics(this.name)]
				: this.labels;
			for (const label of labels)
				this.inquirer["action"](label, _execute.bind(this));
		}
		return this;
	}
}
