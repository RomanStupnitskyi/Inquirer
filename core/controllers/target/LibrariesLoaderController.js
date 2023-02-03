import { BaseController } from "../../../utils/base/BaseController.js";

/**
 * Inquirer controller
 * @since 0.0.1
 * @extends Controller
 */
export default class InquirerController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "libraries_loader",
			target: inquirer.librariesLoader,
			emitters: ["init_error"],
		});
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
