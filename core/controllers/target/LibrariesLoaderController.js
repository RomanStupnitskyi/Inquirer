import { BaseController } from "../../base/BaseController.js";

export default class InquirerController extends BaseController {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "LibrariesLoader",
				target: inquirer.librariesLoader,
				emitters: ["init_error", "load_error"],
			},
			config
		);
	}

	handle_log(collections) {
		for (const [name, size] of Object.entries(collections)) {
			this.inquirer.logger.debug(
				this.name,
				`Successfully loaded ${size} ${name}`
			);
		}
	}
}
