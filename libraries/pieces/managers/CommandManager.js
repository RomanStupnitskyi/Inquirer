import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseCommand } from "../base/BaseCommand.js";

/**
 * Commands manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class CommandsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "commands",
			module: { name: "command", base: BaseCommand },
			...properties,
		});
	}
}
