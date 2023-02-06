import { BaseController } from "../../base/BaseController.js";

export default class ButtonsController extends BaseController {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "button",
				type: "module",
				emitters: ["init_error", "run_error"],
			},
			config
		);
	}
}
