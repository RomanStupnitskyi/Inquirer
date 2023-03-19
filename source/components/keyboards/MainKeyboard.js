import { BaseKeyboard } from "../../../stores/components/keyboards/KeyboardsManager.js";

export default class Main extends BaseKeyboard {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "main",
				rows: [["ask_question", "hide_keyboard"]],
				main: true,
			},
			properties
		);
	}
}
