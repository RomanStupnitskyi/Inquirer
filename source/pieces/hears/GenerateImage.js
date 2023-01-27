import { BaseHear } from "../../../libraries/pieces/base/BaseHear.js";

export default class GenerateImage extends BaseHear {
	constructor(inquirer) {
		super(inquirer, {
			name: "generate_image",
			contents: ["Generate the image", "Згенерувати зображення"],
		});
	}

	async run(ctx) {
		await ctx.reply(ctx.language.getKey("functionalIsDeveloping"));
	}
}
