import { BaseKeyboard } from "../../../libraries/components/keyboards/KeyboardsManager.js";

export default class Main extends BaseKeyboard {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "main",
				rows: [["ask_question", "hide_keyboard"]],
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}
}
