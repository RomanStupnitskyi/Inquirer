import { BaseLibrary } from "../../core/base/BaseLibrary.js";
import { BaseButton as button } from "./base/BaseButton.js";
import { BaseKeyboard as keyboard } from "./base/BaseKeyboard.js";
import { BaseLanguage as language } from "./base/BaseLanguage.js";

/**
 * The components class
 * @since 0.0.1
 */
export class ComponentsLibrary extends BaseLibrary {
	constructor(inquirer) {
		super(inquirer, {
			name: "components",
			modules: { button, keyboard, language },
		});
	}

	getLanguage(ctx) {
		return this["languages"].get(ctx.user.language);
	}
}
