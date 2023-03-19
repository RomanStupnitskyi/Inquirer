import { BaseButton } from "../../../stores/components/buttons/ButtonsManager.js";

export default class EditOpenaiToken extends BaseButton {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "edit_openai_token",
				label: "Edit OpenAI token",
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}

	async _run(token) {
		if (!token) return await this.replyWithReplica("enterToken");

		await this.user.update({ tokenGPT: token });
		await this.replyWithReplica("tokenEdited");
	}
}
