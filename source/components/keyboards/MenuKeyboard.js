import { BaseKeyboard } from "../../../libraries/components/base/BaseKeyboard.js";

export default class MenuKeyboard extends BaseKeyboard {
	constructor(inquirer) {
		super(inquirer, {
			name: "menu",
			buttons: [["ask_the_question", "generate_image"]],
		});
	}
}
