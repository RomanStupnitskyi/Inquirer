import { BaseController } from "../../base/BaseController.js";

export default class KeyboardsController extends BaseController {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "keyboard",
				type: "module",
				emitters: ["init_error", "run_error"],
			},
			config
		);
	}
}
