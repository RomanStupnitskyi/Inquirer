import { Context as TelegrafContext } from "telegraf";
import { User } from "./User.js";

export class Context extends TelegrafContext {
	constructor(inquirer, ...options) {
		super(...options);
		this.inquirer = inquirer;
		this.user = new User(this);
	}

	async apply() {
		await this.user.initialize();
		return this;
	}

	async replyWithReplica(key, ...args) {
		const replica = this.user.language.getReplica(key);
		return await this.reply(replica, ...args);
	}

	static isContext(context) {
		return context instanceof Context || context instanceof TelegrafContext;
	}

	static from(context) {
		const { update, telegram, botInfo } = context;
		return new Context(update, telegram, botInfo);
	}
}
