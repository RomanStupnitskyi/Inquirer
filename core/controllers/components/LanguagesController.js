import { BaseController } from "../../../utils/base/BaseController.js";

export default class LanguageController extends BaseController {
	constructor(inquirer, module) {
		super(
			inquirer,
			{
				name: "language",
				construction: false,
				emitters: ["init_error", "local_keys_error"],
			},
			module
		);
	}

	local_keys_error() {
		this.inquirer.logger.fatal(
			this.title,
			'Getter "LocalKeys" is not declared'
		);
	}
}
