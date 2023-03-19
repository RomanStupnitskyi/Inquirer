import { BaseButton } from "../../../stores/components/buttons/ButtonsManager.js";

export default class HideKeyboard extends BaseButton {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "hide_keyboard",
				fixed: true,
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}

	async _run() {
		await this.replyWithReplica("keyboardHidden", {
			reply_markup: { remove_keyboard: true },
		});
	}
}
