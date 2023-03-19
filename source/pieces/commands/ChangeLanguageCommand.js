import { BaseCommand } from "../../../stores/pieces/commands/CommandsManager.js";

export class ChangeLanguage extends BaseCommand {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "change_language",
				description: "Change the user language",
			},
			properties
		);
	}

	async _run() {
		await this.replyWithReplica(
			"chooseLanguage",
			this.keyboards.getModule("languages").inlineKeyboard(this)
		);
	}
}
