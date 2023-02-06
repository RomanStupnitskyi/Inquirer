/**
 * The user's class by ctx
 * @since 0.0.1
 */
export class User {
	constructor(ctx) {
		if (
			!ctx?.message?.from &&
			!ctx?.update?.message?.from &&
			!ctx?.callbackQuery?.from
		)
			return (this.isValid = false);
		else this.isValid = true;
		this.ctx = ctx;
	}

	/**
	 * The context user's object
	 * @since 0.0.1
	 */
	get ctxUser() {
		return (
			this.ctx.message?.from ||
			this.ctx.update?.message?.from ||
			this.ctx.callbackQuery.from
		);
	}

	/**
	 * The user's identifier
	 * @since 0.0.1
	 */
	get id() {
		return this.ctxUser.id;
	}

	/**
	 * The user's username
	 * @since 0.0.1
	 */
	get username() {
		return this.ctxUser.username || undefined;
	}

	/**
	 * The user's name
	 * @since 0.0.1
	 */
	get name() {
		return this.ctxUser.first_name || undefined;
	}

	/**
	 * The user's surname
	 * @since 0.0.1
	 */
	get surname() {
		return this.ctxUser.last_name || undefined;
	}

	/**
	 * The user's full name
	 * @since 0.0.1
	 */
	get fullName() {
		if (!this.name) return this.surname;
		if (!this.surname) return this.name;
		return `${this.name} ${this.surname}`;
	}

	/**
	 * The user's language
	 * @since 0.0.1
	 */
	get language() {
		return this.config.language;
	}

	/**
	 * Load the user's config
	 * @since 0.0.1
	 */
	async initialize() {
		const config = await this.ctx.inquirer.mysql.user.get({ id: this.id });
		if (config[0]) this.config = config[0];
		else {
			const language = this.ctx.inquirer.components.languages.get(
				this.ctxUser.language_code
			);
			const config = await this.ctx.inquirer.mysql.user.create({
				id: this.id,
				language: language ? language.name : "en",
			});
			this.config = config[0];
		}
	}
}
