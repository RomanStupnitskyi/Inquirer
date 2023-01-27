import { BaseKeyboard } from "../../../libraries/components/base/BaseKeyboard.js";

export default class ConfigKeyboard extends BaseKeyboard {
	constructor(inquirer) {
		super(inquirer, {
			name: "config",
			buttons: [["set_temperature", "set_language"]],
		});
	}
}
