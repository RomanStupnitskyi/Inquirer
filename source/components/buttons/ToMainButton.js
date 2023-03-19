import { BaseButton } from "../../../stores/components/buttons/ButtonsManager.js";

export default class BackButton extends BaseButton {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "to_main_button",
				fixed: true,
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}

	async _run() {
		await this.replyWithReplica(
			"to_main",
			this.keyboards.getModule("main").keyboard(this)
		);
	}
}
