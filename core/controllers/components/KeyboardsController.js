import { BaseController } from "../../../utils/base/BaseController.js";

export default class KeyboardsController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "keyboards",
			construction: false,
			emitters: ["init_error", "run_error"],
		});
	}
}
