import { BaseButton } from "../../../stores/components/buttons/ButtonsManager.js";

export default class UkrainianLanguage extends BaseButton {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "ukrainian",
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}

	async _run() {
		await this.user.changeLanguage("ua");
		await this.replyWithReplica("changedLanguage");
	}
}
