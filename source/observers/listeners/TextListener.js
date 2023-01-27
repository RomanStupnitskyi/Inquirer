import { BaseListener } from "../../../libraries/observers/base/BaseListener.js";

export default class TextListener extends BaseListener {
	constructor(inquirer) {
		super(inquirer, {
			name: "text",
			stable: true,
			cooldown: {
				duration: 15000,
				count: 1,
			},
		});
	}

	async run(ctx) {
		const isOwner =
			ctx.user.isOwner && this.inquirer.constants.owners.ignoreCooldown;

		// COOLDOWN HANDLER
		let cooldown = ctx.session.cooldown.get(this.name);
		if (!isOwner) {
			if (!cooldown) {
				ctx.session.cooldown.set(this.name, {
					count: 1,
					startedAt: Date.now(),
				});
			} else {
				const leftTime = Date.now() - cooldown.startedAt;
				if (leftTime >= this.cooldown.duration)
					ctx.session.cooldown.set(this.name, {
						count: 1,
						startedAt: Date.now(),
					});
				else if (
					leftTime < this.cooldown.duration &&
					this.cooldown.count === cooldown.count
				) {
					return await ctx.reply(
						`❌ Cooldown limit! Try again after ${Math.round(
							(this.cooldown.duration - leftTime) / 1000
						)}s`
					);
				}
			}
		}

		// COMPLETION CODE
		const prompt = ctx.message.reply_to_message
			? `context: "${ctx.message.reply_to_message.text}"\ntext:"${ctx.message.text}"`
			: ctx.message.text;
		const defaultLength = this.inquirer.constants.openAI.about.length;
		if (defaultLength + prompt.length >= 4000)
			return await ctx.reply(
				`❗️ Max length of prompt is ${4000 - defaultLength} symbols`
			);
		const completion = await ctx.telegram["openai"].completion({
			prompt,
			temperature: ctx.user.temperature || 1,
			user: String(ctx.user.id),
		});
		if (completion["error"])
			return ctx.reply(
				`⁉️ Error while searching the answer:\n${completion["error"].message}`
			);
		let answer = completion["choices"].map((i) => i["text"]).join("\n");
		if (!answer) answer = "😞 The answer wasn't generated...";
		await ctx.reply(answer);
	}
}
