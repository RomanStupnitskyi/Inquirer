import { BaseCommand } from "../../../libraries/pieces/base/BaseCommand.js";

/**
 * Command class with name "start"
 * @since 0.0.1
 * @extends Command
 */
export default class StartCommand extends BaseCommand {
	constructor(inquirer, user) {
		super(
			inquirer,
			{ user },
			{
				name: "start",
				description: "Start command to chat with bot",
				stable: true,
			}
		);
	}

	/**
	 * Run method
	 * @since 0.0.1
	 * @param {*} ctx Message context
	 */
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
