import { BaseLanguage } from "../../../libraries/components/languages/LanguagesManager.js";

export default class EnglishLanguage extends BaseLanguage {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "en",
			},
			properties
		);
	}

	get _localKeys() {
		return {
			// Permissions descriptions keys
			use_commands: "Access to use commands",
			use_hears: "Access to use hears",
			use_buttons: "Access to use buttons",
			// Buttons keys
			ask_question: "❓ Send prompt",
			hide_keyboard: "🫣 Hide menu",
		};
	}

	get _keys() {
		return {
			functionalIsDeveloping:
				"Sorry, but you cannot use this functional right now 😢",
			youAreBack: "you are back to the main menu ◀️",
			welcome: "Hello 👋! Nice to meet you here!",
			chooseLanguage: "Choose a language:",
			changedLanguage:
				"✅ You have successfully changed your language to English",
			keyboardHidden:
				"👀 I've hidden the menu. To see it again, use the /show_menu or /settings command",
		};
	}
}
