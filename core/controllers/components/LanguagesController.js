import { BaseController } from "../../base/BaseController.js";

export default class LanguageController extends BaseController {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "language",
				type: "module",
				emitters: [
					"init_error",
					"local_keys_error",
					"keys_error",
					"get_local_key_error",
				],
			},
			config
		);
	}

	local_keys_error() {
		return this.inquirer.logger.fatal(
			this.title,
			'Getter "localKeys" is not declared'
		);
	}

	keys_error() {
		return this.inquirer.logger.fatal(
			this.title,
			'Getter "keys" is not declared'
		);
	}

	get_local_key_error(key) {
		return this.inquirer.logger.fatal(
			this.title,
			`Key '${key}' is not defined in local keys`
		);
	}
}
