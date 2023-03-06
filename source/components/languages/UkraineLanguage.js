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
			// Permissions descriptions keys
			use_commands: "Доступ до використання команд",
			use_hears: "Доступ до використання фраз",
			use_buttons: "Доступ до використання кнопок",
			// Buttons keys
			ask_question: "❓ Відправити запит",
			hide_keyboard: "🫣 Приховати меню",
		};
	}

	get _keys() {
		return {
			functionalIsDeveloping:
				"Не спіши козаче, даний функціонал знаходиться в розробці 🤗",
			youAreBack: "Ти повернувся на Батьківщину 🇺🇦",
			welcome: "Вітаю 👋",
			chooseLanguage: "Вибери рідну мову:",
			changedLanguage: "✅ Українізація пройшла успішно",
			keyboardHidden:
				"👀 Я приховав меню. Щоб знову його бачити, використовуй команду /show_menu або /settings",
		};
	}
}
