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
			ask_question: "❓ Send prompt",
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
		};
	}
}
