import { BaseCommand } from "../../../libraries/pieces/base/BaseCommand.js";

/**
 * Command class with name "terms"
 * @since 0.0.1
 * @extends Command
 */
export default class TermsCommand extends BaseCommand {
	constructor(inquirer) {
		super(inquirer, {
			name: "terms",
			description: "Start command to chat with bot",
			stable: true,
		});
	}

	/**
	 * Run method
	 * @since 0.0.1
	 * @param {*} ctx Message context
	 */
	async run(ctx) {
		await ctx.reply(ctx.language.getKey("termsOfUse"), {
			parse_mode: "Markdown",
		});
	}
}
