import { BaseLanguage } from "../../../libraries/components/base/BaseLanguage.js";

export default class UkraineLanguage extends BaseLanguage {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "ua",
			},
			config
		);
	}

	get localKeys() {
		return {};
	}

	get keys() {
		return {
			functionalIsDeveloping:
				"Не спіши козаче, даний функціонал знаходиться в розробці 🤗",
			youAreBack: "Ти повернувся на Батьківщину 🇺🇦",
			welcome:
				"Вітаю козаче 👋!\nПрошу ознайомитись з *умовами використання* (/terms) перед експуатацією бота.",
			chooseLanguage: "Вибери рідну мову:",
			changedLanguage: "✅ Українізація пройшла успішно",
			howToUse:
				"Це простіше, чим тобі здається! Тобі потрібно просто відправити повідомлення, щоб отримати відповідь 😉",
			termsOfUse: `❗️ *Умови використання:*
					\n1. _Використовуючи бота, Ви погоджуєтесь, що росія - країна-терорист та з нижче наведеними умовами користування._
					\n2. _Використовуючи бота, Ви даєте згоду на обробку особистих даних телеграм аккаунту._
					\n3. _Ви не маєте права використовувати бота у спосіб, який порушує, привласнює або порушує права будь-якої особи._
					\n4. _Ви не маєте права використовувати бота з ціллю генерування пропаганди._
					\n5. _Бот може надавати хибну інформацію на теми, що є актуальними в сьогоденні (в наступному пункті описано чим це зумовлено)._
					\n6. _Бот володіє інформацією, що є актуальною до 2020 року. Це пов'язано з тим, що модель штучного інтелекту формувалась на інформації, актуальній в 2020 році._
					\n7. _Формування відповіді може тривати до 1 хвилини: це залежить від самого запиту та зазначеної температури._
					\n8. _Температура - значення, що вимірюється у відсотках та відповідає за наповненость та мудрість відповіді. Змінити цей параметр можна в налаштуваннях. Зверніть увагу, що цей параметр впливає на швидкість формування запиту._
					\n9. _Ми не гарантуємо повну унікальність відповіді вашого запиту, якщо Ваш запит має одинаковий сенс. Наприклад, якщо Ваш запит буде "Якого кольор небо?", то в цьому впадкуу всіх користувачів відповідь буде однаковою - "блакитного кольору"._
					\n10. _Контекст чату не враховується у ваших запитах, тобто бот не має змоги читати та враховувати всі повідомлення, що знаходяться вище. Виключенням є повідомлення, на яке ви відповідаєте._
					\n11. _Бот використовує ліміти, що дають змогу надсилати запит раз в 30 секунд. Це пов'язано з обмеженнями OpenAI API._
					\n12. _Ми маємо право заблокувати Вам доступ до використання бота, якщо ваші дії негативно спрямовані на стабільність роботи бота або будуть порушувати правила використання._
					`,
		};
	}
}
