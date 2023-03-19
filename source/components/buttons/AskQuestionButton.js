import { BaseButton } from "../../../stores/components/buttons/ButtonsManager.js";

export default class AskQuestion extends BaseButton {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "ask_question",
				label: "Hi",
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}

	async _run(prompt) {
		if (!prompt) return this.replyWithReplica("functionalIsDeveloping");
		const answer = await this.services.get("openai").completion({
			prompt,
			...user.openAIConfig,
		});
		await this.reply(answer, {
			parse_mode: "markdown",
		});
	}
}
