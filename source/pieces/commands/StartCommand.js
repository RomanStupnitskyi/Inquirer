import { BaseCommand } from "../../../libraries/pieces/commands/CommandsManager.js";

export default class StartCommand extends BaseCommand {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "start",
				description: "Start command to chat with bot",
			},
			properties
		);
	}

	async _run() {
		await this.replyWithReplica(
			"welcome",
			this.keyboards.getModule("main").keyboard(this)
		);
	}
}
