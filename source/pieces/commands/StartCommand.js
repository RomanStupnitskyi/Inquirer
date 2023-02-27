import { BaseCommand } from "../../../libraries/pieces/base/BaseCommand.js";

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
		await this.reply("Hello!");
	}
}
