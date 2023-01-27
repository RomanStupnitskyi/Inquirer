import { BaseKeyboard } from "../../../libraries/components/base/BaseKeyboard.js";

export default class ConfigKeyboard extends BaseKeyboard {
	constructor(inquirer, user) {
		super(inquirer, user, {
			name: "config",
			buttons: [["set_temperature", "set_language"]],
		});
	}
}
