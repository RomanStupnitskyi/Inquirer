import { BaseKeyboard } from "../../../libraries/components/base/BaseKeyboard.js";

export default class LanguageKeyboard extends BaseKeyboard {
	constructor(inquirer, user) {
		super(inquirer, user, {
			name: "language",
			buttons: [["ua", "en"]],
		});
	}
}
