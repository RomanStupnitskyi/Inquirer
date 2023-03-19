import { BaseCommand } from "../../../stores/pieces/commands/CommandsManager.js";

export default class OpenAI extends BaseCommand {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "openai",
				description: "OpenAI settings",
			},
			properties
		);
	}

	async _run() {
		await this.replyWithReplica(
			{
				key: "editOpenAI",
				args: [this.user],
			},
			{
				...this.keyboards.getModule("openai_settings").inlineKeyboard(this),
				parse_mode: "Markdown",
			}
		);
	}
}
