import { BaseCommand } from "../../../stores/pieces/commands/CommandsManager.js";

export default class ShowMenu extends BaseCommand {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "show_menu",
				description: "Show the main menu",
			},
			properties
		);
	}

	async _run() {
		await this.replyWithReplica(
			"menuShowed",
			this.keyboards.getModule("main").keyboard(this)
		);
	}
}
