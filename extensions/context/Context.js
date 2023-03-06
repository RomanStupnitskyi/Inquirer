import { Context as TelegrafContext } from "telegraf";
import { User } from "./User.js";

export class Context extends TelegrafContext {
	constructor(inquirer, ...options) {
		super(...options);
		this.inquirer = inquirer;
		this.user = new User(this);

		for (const [name, manager] of this.inquirer.components) {
			this[name] = manager;
		}
	}

	async apply() {
		await this.user.initialize();
		return this;
	}

	async replyWithReplica(keyParameters, ...replyArgs) {
		if (typeof keyParameters === "string") {
			const key = keyParameters;
			const replica = this.user.language.getReplica(key);
			return await this.reply(replica, ...replyArgs);
		}

		const { key, args } = keyParameters;
		const replica = this.user.language.getReplica(key);

		if (typeof replica === "function")
			return await this.reply(replica(...args), ...replyArgs);
		return await this.reply(replica, ...replyArgs);
	}

	static isContext(context) {
		return context instanceof Context || context instanceof TelegrafContext;
	}

	static from(context) {
		const { update, telegram, botInfo } = context;
		return new Context(update, telegram, botInfo);
	}
}
