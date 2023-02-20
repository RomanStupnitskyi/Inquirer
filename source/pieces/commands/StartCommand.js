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

	async run(ctx) {
		const keyboard = ctx.keyboards.get("language");
		await ctx.reply(ctx.language.getKey("welcome"), {
			parse_mode: "Markdown",
		});
		await ctx.reply(ctx.language.getKey("chooseLanguage"), {
			parse_mode: "Markdown",
			reply_markup: keyboard,
		});
	}
}
