import { BaseLanguage } from "../../../stores/components/languages/LanguagesManager.js";

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
			to_main_button: "↩️ To main",
			ask_question: "❓ Send prompt",
			hide_keyboard: "*️⃣ Hide menu",
			ukrainian: "🇺🇦 Ukrainian",
			english: "🇺🇸 English",
			edit_temperature: "Change temperature",
			edit_openai_token: "Change token",
		};
	}

	get _keys() {
		return {
			to_main: "You back to the main menu 👍",
			functionalIsDeveloping:
				"Sorry, but you cannot use this functional right now 😢",
			youAreBack: "you are back to the main menu ◀️",
			commandNotFound: "❌ Sorry, I don't have this command",
			welcome: "Hello 👋! Nice to meet you here!",
			chooseLanguage: "🗣 Choose a language:",
			changedLanguage:
				"✅ You have successfully changed your language to English",
			languageNotChanged: (language) =>
				`Something went wrong... '${language}'`,
			keyboardHidden:
				"👀 I've hidden the menu. To see it again, use the /show_menu or /settings command",
			menuShowed: "✅ Menu showed!",
			timeToAnswerIsOver:
				"Tick tock, tick tock... Time to answer has expired ⌛️",
			unregistered_openai_token:
				"🚫 Sorry, you can't send a request because you haven't entered your OpenAI token!\n\n• Use /openai_token to learn about the OpenAI token.\n• Use /openai or /settings to specify or change the token.",
			wait_responce: "Waiting responce...",
			editOpenAI: (user) =>
				`OpenAI settings\n\nToken: \`${user.data.tokenGPT}\`\nModel: \`${user.data.modelGPT}\`\nTemperature: \`${user.data.temperature}\``,

			enterTemperature: "Enter the response temperature (from 0 to 100)",
			temperatureRangeError:
				"❌ The temperature must be a number from 0 to 100",
			temperatureEdited: (temperature) =>
				`✅ The temperature has been changed to ${temperature}`,

			// Button "edit_openai_token"
			enterToken: "Enter OpenAI token",
			tokenEdited: "✅ Token successfully changed",
		};
	}
}
