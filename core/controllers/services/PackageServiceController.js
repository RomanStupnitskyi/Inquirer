import { BaseController } from "../../../utils/base/BaseController.js";

/**
 * Inquirer controller
 * @since 0.0.1
 * @extends Controller
 */
export default class openaiController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "packages",
			construction: false,
			emitters: ["info"],
		});
	}
}
