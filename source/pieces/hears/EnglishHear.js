import { BaseHear } from "../../../libraries/pieces/base/BaseHear.js";

export default class EnglishHear extends BaseHear {
	constructor(inquirer) {
		super(inquirer, {
			name: "en",
			contents: ["🇺🇸 English", "🇺🇸 Англійська"],
		});
	}

	async run(ctx) {
		const menu = ctx.keyboards.get("menu");
		if (ctx.user.lang !== this.name) {
			await ctx.telegram["mysql"].user.update(
				{ id: ctx.user.id },
				{ language: this.name }
			);
			ctx.user.lang = this.name;
			ctx.language = this.inquirer.components.languages.get(this.name);
		}
		await ctx.reply(ctx.language.getKey("changedLanguage"), {
			reply_markup: menu,
		});
	}
}
