import { BaseListener } from "../../../libraries/observers/base/BaseListener.js";

export default class TextListener extends BaseListener {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "text",
			},
			properties
		);
	}

	async run(ctx) {
		await ctx.reply(ctx.message.text);
	}
}
