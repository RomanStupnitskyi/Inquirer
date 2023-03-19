/**
 * User class by context
 * @since 0.0.1
 */
export class User {
	#context;

	constructor(context) {
		if (
			!context?.message?.from &&
			!context?.update?.message?.from &&
			!context?.callbackQuery?.from
		)
			return (this.error = { message: "User is not defined" });
		this.#context = context;
	}

	/**
	 * The context user's object
	 * @since 0.0.1
	 */
	get contextUser() {
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
		return this.contextUser.id;
	}

	/**
	 * The user's username
	 * @since 0.0.1
	 */
	get username() {
		return this.contextUser.username || undefined;
	}

	/**
	 * The user's name
	 * @since 0.0.1
	 */
	get name() {
		return this.contextUser.first_name || undefined;
	}

	/**
	 * The user's surname
	 * @since 0.0.1
	 */
	get surname() {
		return this.contextUser.last_name || undefined;
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
		return this.#context.inquirer.components.languages.getModule(
			this.data.language
		);
	}

	get isOwner() {
		return this.inquirer.owners.ids.includes(this.id);
	}

	/**
	 * Load the user's config
	 * @since 0.0.1
	 */
	async initialize() {
		const data = await this.#context.inquirer.mysql.user.get({
			id: this.id,
		});
		if (data[0]) {
			this.data = data[0];
			if (this.data.roles) this.data.roles = JSON.parse(this.data.roles);
		} else {
			const language = this.#context.inquirer.components.languages.get(
				this.contextUser.language_code
			);
			const data = await this.#context.inquirer.mysql.user.create({
				id: this.id,
				language: language ? language.name : "en",
			});
			this.data = data[0];
		}
	}

	async changeLanguage(language = "en") {
		if (!this.#context.inquirer.components.languages.getModule(language))
			return false;
		await this.#context.inquirer.mysql.user.update(
			{ id: this.id },
			{ language }
		);
		this.data.language = language;
		return true;
	}

	async update(parameters) {
		const updated = await this.#context.inquirer.mysql.user.update(
			{ id: this.id },
			parameters
		);
		this.data = updated;
		return updated;
	}
}
