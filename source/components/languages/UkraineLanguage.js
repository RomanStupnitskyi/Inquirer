import { BaseLanguage } from "../../../stores/components/languages/LanguagesManager.js";

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
			to_main_button: "↩️ На головну",
			ask_question: "❓ Відправити запит",
			hide_keyboard: "*️⃣ Приховати меню",
			ukrainian: "🇺🇦 Українська",
			english: "🇺🇸 Англійська",
			edit_temperature: "Змінити температуру",
			edit_openai_token: "Змінити токен",
		};
	}

	get _keys() {
		return {
			to_main: "Ти повернувся на головну 👍",
			functionalIsDeveloping:
				"Не спіши козаче, даний функціонал знаходиться в розробці 🤗",
			youAreBack: "Ти повернувся на Батьківщину 🇺🇦",
			commandNotFound: "❌ Перепрошую, але команда відсутня",
			welcome: "Вітаю 👋",

			chooseLanguage: "🗣 Вибери свою мову:",
			changedLanguage: "✅ Українізація пройшла успішно",
			languageNotExists: (language) => `Я не володію мовою '${language}'`,

			keyboardHidden:
				"👀 Я приховав меню. Щоб знову його бачити, використовуй команду /show_menu або /settings",
			menuShowed: "✅ Меню з'явилось!",
			timeToAnswerIsOver:
				"Тік так, тік так... Час на відповідь вичерпано ⌛️",
			unregistered_openai_token:
				"🚫 Ви не можете надіслати запит, адже не ввели токен OpenAI!\n\n• Використовуйте /openai_token, щоб дізнатись про токен OpenAI.\n• Використовуй /openai або /settings, щоб вказати або змінити токен",
			wait_responce: "Очікується відповідь...",
			editOpenAI: (user) =>
				`Налаштування OpenAI\n\nToken: \`${user.data.tokenGPT}\`\nModel: \`${user.data.modelGPT}\`\nTemperature: \`${user.data.temperature}\``,

			// Button "edit_temperature"
			enterTemperature: "Введіть температуру відповіді (від 0 до 100)",
			temperatureRangeError: "❌ Температура має бути числом від 0 до 100",
			temperatureEdited: (temperature) =>
				`✅ Температуру змінено на ${temperature}`,

			// Button "edit_openai_token"
			enterToken: "Введіть OpenAI токен",
			tokenEdited: "✅ Токен успішно змінено",
		};
	}
}
