import { BaseButton } from "../../../libraries/components/base/BaseButton.js";

export default class AskQuestion extends BaseButton {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "ask_question",
				labels: ["Hi"],
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}

	async _run(prompt) {
		if (!prompt) return this.reply("Send your prompt");
		const answer = await this.services.get("openai").completion({
			prompt,
			...user.openAIConfig,
		});
		await this.reply(answer, {
			parse_mode: "markdown",
		});
	}
}
