import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Base command class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseCommand extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			options: [
				{
					id: "description",
					type: String,
					default: "Inquirer command",
				},
				{
					id: "cooldown",
					type: Object,
					default: {
						count: 0,
						duration: 0,
					},
				},
				{
					id: "hidden",
					type: Boolean,
					default: true,
				},
			],
			optionsArguments,
			...properties,
		});
	}

	/**
	 * Initialize the command
	 * @since 0.0.1
	 * @returns Current command class
	 */
	_prepare() {
		if (!this.inquirer.constants.telegrafCommands) return this;
		const _execute = async function (ctx, ...args) {
			ctx.inquirer = this.inquirer;
			const command = this.inquirer.pieces.cache
				.get(this._properties.manager.name)
				.cache.get(this.name);
			const isOwner =
				ctx.user.isOwner && this.inquirer.constants.owners.useHiddenPieces;
			if (command && (!command.hidden || (command.hidden && isOwner)))
				await this["execute"](ctx, ...args);
			else return false;
		};
		this.inquirer["command"](this.name, _execute.bind(this));
		return this;
	}
}
