import { BaseController } from "../../../utils/base/BaseController.js";

export default class ButtonsController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "button",
			construction: false,
			emitters: ["init_error", "run_error"],
		});
	}
}
