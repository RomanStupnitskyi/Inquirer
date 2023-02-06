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
				name: "packageService",
				type: "module",
				emitters: ["info"],
			},
			config
		);
	}
}
