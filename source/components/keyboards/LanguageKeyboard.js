import { BaseKeyboard } from "../../../libraries/components/base/BaseKeyboard.js";

export default class LanguageKeyboard extends BaseKeyboard {
	constructor(inquirer) {
		super(inquirer, {
			name: "language",
			buttons: [["ua", "en"]],
		});
	}
}
