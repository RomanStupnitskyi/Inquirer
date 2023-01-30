import { BaseModule } from "../../../utils/base/BaseModule.js";

export class BaseButton extends BaseModule {
	constructor(inquirer, depends, parameters = {}) {
		super(
			inquirer,
			{
				depends,
				config: {
					dependent: true,
					useExecutor: true,
				},
				options: [
					{
						id: "name",
						type: String,
						required: true,
						unique: true,
					},
				],
			},
			parameters
		);
		this._addOption(
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
