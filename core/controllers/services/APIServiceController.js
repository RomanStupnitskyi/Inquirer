import { BaseController } from "../../base/BaseController.js";

/**
 * Inquirer controller
 * @since 0.0.1
 * @extends Controller
 */
export default class openaiController extends BaseController {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "api",
				type: "module",
				emitters: ["info", "completion_error"],
			},
			config
		);
	}

	completion_error(...messages) {
		this.inquirer.logger.error(
			this.name,
			`An error occurred while completition requested: ${messages.join(" ")}`
		);
	}
}
