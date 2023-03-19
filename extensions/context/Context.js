import { Context as TelegrafContext } from "telegraf";
import { User } from "./User.js";
import { WaitResponce } from "./WaitResponce.js";

/**
 * Customized context class for Telegraf bot.
 * @extends TelegrafContext
 * @since 1.0.0
 */
export class Context extends TelegrafContext {
	/**
	 * Create a new Context instance.
	 * @param {Inquirer} inquirer - The inquirer client.
	 * @param {object} options - Optional parameters passed to the telegraf context.
	 */
	constructor(inquirer, ...options) {
		super(...options);
		this.inquirer = inquirer;
		this.user = new User(this);

		for (const [name, manager] of this.inquirer.components) {
			this[name] = manager;
		}
	}

	/**
	 * Initialize the user and returns the context.
	 * @returns {Context} Returns the context instance.
	 */
	async apply() {
		if (!this.message && !this.update.callback_query) {
			return this;
		}
		await this.user.initialize();
		return this;
	}

	/**
	 * Reply with a replica to a user's message.
	 * @param {string | { key: string, args: any[] }} keyParameters - The replica key or an object containing the key and its arguments.
	 * @param  {...any} replyArgs - Optional arguments passed to the reply method.
	 * @returns {Promise<Message>} Returns the message instance.
	 */
	async replyWithReplica(keyParameters, ...replyArgs) {
		if (typeof keyParameters === "string") {
			const key = keyParameters;
			const replica = this.user.language.getReplica(key);
			return await this.reply(replica, ...replyArgs);
		}

		const { key, args } = keyParameters;
		const replica = this.user.language.getReplica(key, ...args);
		return await this.reply(replica, ...replyArgs);
	}

	/**
	 * Wait for a response from the user.
	 * @param {string} waitFor - The expected type of response from the user.
	 * @param {number} duration - The duration of the wait in seconds.
	 * @returns {WaitResponce} Returns a new WaitResponce instance.
	 */
	waitResponce(waitFor = "text", duration = 60) {
		return (this.session.waitResponce = new WaitResponce(this, {
			piece: this.piece,
			waitFor,
			duration,
		}));
	}

	/**
	 * Checks if an object is an instance of the Context class.
	 * @param {object} context - The object to check.
	 * @returns {boolean} Returns true if the object is an instance of Context class, else false.
	 */
	static isContext(context) {
		return context instanceof Context;
	}

	/**
	 * Checks if an object is an instance of the TelegrafContext class.
	 * @param {object} context - The object to check.
	 * @returns {boolean} Returns true if the object is an instance of TelegrafContext class, else false.
	 */
	static isTelegrafContext(context) {
		return context instanceof TelegrafContext;
	}

	/**
	 * Create a new Context instance from a Telegraf context.
	 * @param {TelegrafContext} context - The Telegraf context to create the new instance from.
	 * @returns {Context} Returns a new Context instance.
	 */
	static from(context) {
		const { update, telegram, botInfo } = context;
		return new Context(update, telegram, botInfo);
	}
}
