import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Commands' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class CommandsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "command", baseclass: BaseCommand },
			...properties,
		});
	}
}

/**
 * Command base class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseCommand extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			executeLog: true,
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
					default: false,
				},
			],
			optionsArguments,
			...properties,
		});
	}

	log(context) {
		const fullName = context.user.fullName;
		const username = context.user.username
			? `@${context.user.username}`
			: "@invalid_user";
		this._logger.debug(
			`${fullName} (${username}:${context.user.id}): ${context.message.text}`
		);
	}

	initialize() {
		if (this.inquirer.constants.telegrafCommands)
			this.inquirer["command"](this.name, this.execute);
	}
}
