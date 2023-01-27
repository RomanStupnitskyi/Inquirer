import { BaseHear } from "../../../libraries/pieces/base/BaseHear.js";

export default class AskTheQuestion extends BaseHear {
	constructor(inquirer) {
		super(inquirer, {
			name: "back",
			contents: ["◀️ Back", "◀️ Назад"],
		});
	}

	async run(ctx) {
		const menu = ctx.keyboards.get("menu");
		await ctx.reply(ctx.language.getKey("youAreBack"), {
			reply_markup: menu,
		});
	}
}
