import { BaseController } from "../../../utils/base/BaseController.js";

export default class ButtonsController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "buttons",
			construction: false,
			emitters: ["init_error", "run_error"],
		});
	}
}
