import { BaseButton } from "../../../stores/components/buttons/ButtonsManager.js";

export default class EnglishLanguage extends BaseButton {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "english",
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}

	async _run() {
		const changed = await this.user.changeLanguage("en");
		if (changed) await this.replyWithReplica("changedLanguage");
		else
			await this.replyWithReplica({
				key: "languageNotChanged",
				args: [language],
			});
	}
}
