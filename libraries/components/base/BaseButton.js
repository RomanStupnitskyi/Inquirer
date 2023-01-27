import { BaseModule } from "../../../utils/base/BaseModule.js";

export class BaseButton extends BaseModule {
	constructor(inquirer, user, parameters) {
		super(
			inquirer,
			[
				{
					id: "name",
					type: String,
					required: true,
					unique: true,
				},
			],
			parameters
		);
		this.user = user;
		this._addOptionParameter(
			"text",
			inquirer.components.languages
				.get(user.language)
				.getLocalKey(parameters.name)
		);
	}

	async run(...args) {
		await this.run(...args);
	}
}
