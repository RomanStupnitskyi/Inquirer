import { BaseController } from "../../base/BaseController.js";

export default class InquirerController extends BaseController {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "inquirer",
				target: inquirer,
				emitters: ["handle_log"],
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
