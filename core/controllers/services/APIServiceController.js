import { BaseController } from "../../../utils/base/BaseController.js";

/**
 * Inquirer controller
 * @since 0.0.1
 * @extends Controller
 */
export default class openaiController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "api",
			construction: false,
			emitters: ["info", "completion_error"],
		});
	}

	completion_error(...messages) {
		this.inquirer.logger.error(
			this.name,
			`An error occurred while completition requested: ${messages.join(" ")}`
		);
	}
}
