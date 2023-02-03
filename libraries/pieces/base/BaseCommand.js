import { BaseModule } from "../../../utils/base/BaseModule.js";

/**
 * Base command class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseCommand extends BaseModule {
	constructor(inquirer, parameters = {}, config = { production: true }) {
		super(
			inquirer,
			{
				config: {
					dependent: true,
					useExecutor: true,
					...config,
				},
				options: [
					{
						id: "name",
						type: String,
						required: true,
						unique: true,
					},
					{
						id: "description",
						type: String,
						default: "Inquirer command",
					},
					{
						id: "cooldown",
						type: Object,
					},
					{
						id: "hidden",
						type: Boolean,
						default: true,
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
	 * Initialize the command
	 * @since 0.0.1
	 * @returns Current command class
	 */
	prepare() {
		if (!this.inquirer.constants.telegrafCommands) return this;
		const _execute = async function (ctx) {
			const command = this.inquirer.listeners.get(this.name);
			const isOwner =
				ctx.user.isOwner && this.inquirer.constants.owners.useHiddenPieces;
			if (command && (!command.hidden || (command.hidden && isOwner)))
				await this["execure"](ctx);
			else return false;
		};
		this.inquirer["command"](
			this.name,
			this.stable ? this["execute"] : _execute.bind(this)
		);
		return this;
	}
}
