import { BaseController } from "../../../utils/base/BaseController.js";

/**
 * Inquirer controller
 * @since 0.0.1
 * @extends Controller
 */
export default class InquirerController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "inquirer",
			target: inquirer,
			emitters: ["handle_log"],
		});
	}

	handle_log(collections) {
		for (const [name, size] of Object.entries(collections)) {
			this.inquirer.logger.info(
				this.name,
				`Successfully loaded ${size} ${name}`
			);
		}
	}
}
