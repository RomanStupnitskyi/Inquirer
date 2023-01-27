import { BaseController } from "../../../utils/base/BaseController.js";

export default class LanguageController extends BaseController {
	constructor(inquirer) {
		super(inquirer, {
			name: "languages",
			construction: false,
			emitters: ["init_error"],
		});
	}
}
