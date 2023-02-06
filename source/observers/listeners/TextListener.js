import { BaseListener } from "../../../libraries/observers/base/BaseListener.js";

export default class TextListener extends BaseListener {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "text",
				stable: true,
			},
			config
		);
	}

	async run(ctx) {
		await ctx.reply(ctx.message.text);
	}
}
