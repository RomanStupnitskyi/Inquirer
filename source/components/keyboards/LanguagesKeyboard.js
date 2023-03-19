import { BaseKeyboard } from "../../../stores/components/keyboards/KeyboardsManager.js";

export default class Languages extends BaseKeyboard {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "languages",
				rows: [["english", "ukrainian"]],
			},
			properties
		);
	}
}
