/**
 * User class by context
 * @since 0.0.1
 */
export class User {
	#context;

	constructor(ctx) {
		if (
			!ctx?.message?.from &&
			!ctx?.update?.message?.from &&
			!ctx?.callbackQuery?.from
		)
			return (this.isValid = false);
		else this.isValid = true;
		this.#context = ctx;
	}

	/**
	 * The context user's object
	 * @since 0.0.1
	 */
	get ctxUser() {
		return (
			this.#context.message?.from ||
			this.#context.update?.message?.from ||
			this.#context.callbackQuery.from
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

	get isOwner() {
		return this.inquirer.owners.ids.includes(this.id);
	}

	/**
	 * Load the user's config
	 * @since 0.0.1
	 */
	async initialize() {
		const properties = await this.#context.inquirer.mysql.user.get({
			id: this.id,
		});
		if (properties[0]) this.properties = properties[0];
		else {
			const language = this.#context.inquirer.components.languages.get(
				this.ctxUser.language_code
			);
			const properties = await this.#context.inquirer.mysql.user.create({
				id: this.id,
				language: language ? language.name : "en",
			});
			this.properties = properties[0];
		}
	}
}
