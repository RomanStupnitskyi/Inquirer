import { BaseKeyboard } from "../../../stores/components/keyboards/KeyboardsManager.js";

export default class Main extends BaseKeyboard {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "openai_settings",
				rows: [["edit_temperature", "edit_openai_token"]],
			},
			properties
		);
	}
}
