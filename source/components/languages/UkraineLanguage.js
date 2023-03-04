import { BaseLanguage } from "../../../libraries/components/languages/LanguagesManager.js";

export default class UkraineLanguage extends BaseLanguage {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "ua",
			},
			properties
		);
	}

	get _localKeys() {
		return {
			ask_question: "❓ Відправити запит",
		};
	}

	get _keys() {
		return {
			functionalIsDeveloping:
				"Не спіши козаче, даний функціонал знаходиться в розробці 🤗",
			youAreBack: "Ти повернувся на Батьківщину 🇺🇦",
			welcome:
				"Вітаю козаче 👋!\nПрошу ознайомитись з *умовами використання* (/terms) перед експуатацією бота.",
			chooseLanguage: "Вибери рідну мову:",
			changedLanguage: "✅ Українізація пройшла успішно",
		};
	}
}
