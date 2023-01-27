import { BaseController } from "../../../utils/base/BaseController.js";

/**
 * Inquirer controller
 * @since 0.0.1
 * @extends Controller
 */
export default class ModulesController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "modules",
			target: inquirer.modules,
			emitters: ["info", "load_error", "init_error"],
		});
	}
}
