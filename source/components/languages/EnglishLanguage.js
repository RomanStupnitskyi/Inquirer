import { BaseLanguage } from "../../../libraries/components/base/BaseLanguage.js";

export default class EnglishLanguage extends BaseLanguage {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "en",
			},
			config
		);
	}

	get localKeys() {
		return {
			name: "name",
		};
	}

	get keys() {
		return {
			functionalIsDeveloping:
				"Sorry, but you cannot use this functional right now 😢",
			youAreBack: "you are back to the main menu ◀️",
			welcome:
				"Hello 👋! Nice to meet you here! Please read the /terms of use before using the bot!",
			chooseLanguage: "Choose a language:",
			changedLanguage:
				"✅ You have successfully changed your language to English",
			howToUse:
				"It's very simple! You just need to send a message to get a response 😉",
			termsOfUse: `❗️ *Terms of use:*
				\n1. _These Terms of Use apply when you use the bot._
				\n2. _Нou agree to the processing of personal data of your Telegram account and russia is a terrorist country._
				\n3. _We do not guarantee that your query will be completely unique if your query has the same meaning. For example, if your query is "What color is the sky?", then in this case, all users will receive the same answer - "blue"._
				\n4. _You may not use the bot in any way that violates, misappropriates or infringes the rights of any person._
				\n5. _You may not use a bot to generate propaganda._
				\n6. _The bot may provide false information on topics that are relevant today (the next paragraph describes what causes this)._
				\n7. _The bot has information relevant to 2020. The reason for this is that the artificial intelligence model was formed on information relevant in 2020._
				\n8. _It can take up to 1 minute to generate a response: it depends on the request itself and the specified temperature._
				\n9. _Temperature is a value measured in percentage and is responsible for the completeness and wisdom of the answer. You can change this parameter in the settings. Please note that this parameter affects the speed of query generation._
				\n10. _The context of the chat is not taken into account in your queries, meaning that the bot cannot read and consider all messages above it. The exception is the message you reply to._
				\n11. _The bot uses limits that allow it to send a request once every 30 seconds. This is due to the limitations of the OpenAI API._
				\n12. _We have the right to block your access to use the bot if your actions negatively affect the stability work of the bot or violate the rules of use._
				`,
		};
	}
}
