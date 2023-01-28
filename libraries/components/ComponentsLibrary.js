import { BaseLibrary } from "../../utils/base/BaseLibrary.js";
import { BaseButton as buttons } from "./base/BaseButton.js";
import { BaseKeyboard as keyboards } from "./base/BaseKeyboard.js";
import { BaseLanguage as languages } from "./base/BaseLanguage.js";

/**
 * The components class
 * @since 0.0.1
 */
export class ComponentsLibrary extends BaseLibrary {
	constructor(inquirer) {
		super(inquirer, {
			name: "components",
			modules: { buttons, keyboards, languages },
		});
	}

	getLanguage(ctx) {
		return this["languages"].get(ctx.user.language);
	}
}
