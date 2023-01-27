import { BaseHear } from "../../../libraries/pieces/base/BaseHear.js";

export default class AskTheQuestion extends BaseHear {
	constructor(inquirer) {
		super(inquirer, {
			name: "ask_the_question",
			contents: ["❓ How to use", "❓ Як використовувати"],
		});
	}

	async run(ctx) {
		await ctx.reply(ctx.language.getKey("howToUse"), {
			parse_mode: "Markdown",
		});
	}
}
