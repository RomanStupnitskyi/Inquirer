import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";
import { Context } from "../../../extensions/context/Context.js";

/**
 * Listeners' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class ListenersManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "listener", baseclass: BaseListener },
			...properties,
		});
	}
}

/**
 * Listener base class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseListener extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			executeLog: true,
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

	log(context) {
		if (context instanceof Context) {
			const fullName = context.user.fullName;
			const username = context.user.username
				? `@${context.user.username}`
				: "@invalid_user";
			this._logger.debug(
				`${fullName} (${username}:${context.user.id}): ${context.message.text}`
			);
		}
	}

	initialize() {
		const type = this.once ? "once" : "on";
		this.inquirer[type](this.name, this.execute);
	}
}
