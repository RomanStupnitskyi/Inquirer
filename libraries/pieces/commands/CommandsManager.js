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

	_prepare() {
		if (this.inquirer.constants.telegrafCommands)
			this.inquirer["command"](this.name, this.execute);
	}
}
