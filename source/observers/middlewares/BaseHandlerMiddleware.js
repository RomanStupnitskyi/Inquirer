import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";
import { Collection } from "../../../utils/Collection.js";

/**
 * Middleware class to handle basical data
 * @since 0.0.1
 * @extends Middleware
 */
export default class BaseHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer) {
		super(inquirer, {
			name: "baseHandler",
			stable: true,
		});
	}

	/**
	 * Run method
	 * @param {*} ctx Message context
	 * @param {*} next Function to execute next contextHandlers
	 * @returns null
	 */
	async run(ctx, next) {
		const user = ctx.message?.from || ctx.callbackQuery.from;
		if (!user) return;

		if (!ctx.session.wrapper) {
			// in development
		}

		ctx.telegram["mysql"] = this.inquirer.mysql;
		for (const collectionName of this.inquirer.modules.collections) {
			let collection = this.inquirer.modules[collectionName];
			collection = collection.filter((i) => i.useContext);
			if (collection.size > 0)
				collection.forEach((i) => (ctx.telegram[i.name] = i));
		}
		let record = await ctx.telegram["mysql"].user.get({ id: user.id }, true);
		record = record[0];
		ctx.user = {
			id: user.id,
			username: `${user.first_name} ${user.last_name}`,
			temperature: record.temperature,
			lang: record.language,
		};
		ctx.language = this.inquirer.components.languages.get(ctx.user.lang);
		if (!ctx.message || !ctx.message.text) return next();

		if (!ctx.session["cooldown"]) ctx.session["cooldown"] = new Collection();
		if (ctx.session["wait"]) {
			const command = this.inquirer["commands"].get(
				ctx.session["wait"].commandName
			);
			clearTimeout(ctx.session["wait"].timeout);
			delete ctx.session["wait"];
			return await command._run(ctx, ctx.message.text);
		}
		ctx.keyboards = this.inquirer.components.keyboards;
		next();
	}
}
