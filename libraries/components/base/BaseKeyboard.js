import { BaseModule } from "../../../utils/base/BaseModule.js";

export class BaseKeyboard extends BaseModule {
	constructor(inquirer, parameters = {}, config = { production: true }) {
		super(
			inquirer,
			{
				config: {
					dependent: true,
					useExecutor: false,
					...config,
				},
				options: [
					{
						id: "name",
						type: String,
						required: true,
						unique: true,
					},
					{
						id: "buttons",
						type: Array,
						default: [],
					},
					{
						id: "resize_keyboard",
						type: Boolean,
						default: true,
					},
					{
						id: "hidden",
						type: Boolean,
						default: false,
					},
				],
			},
			parameters
		);
		this.user = user;
	}

	get buttons() {
		const buttons = [];
		const back = this.inquirer.components.buttons.get("back");
		for (const line of this.buttons) {
			for (const buttonName of line) {
				const Handler = this.inquirer.components.buttons.get(buttonName);
				if (!Handler) {
					this.inquirer.logger.error(
						this.name,
						`Handler '${buttonName}' is not defined`
					);
					continue;
				}
				const handler = new Handler(this.inquirer, this.user);

				const index = this.buttons.indexOf(line);
				if (!buttons[index]) buttons.push([]);
				buttons[index].push([handler.text, handler.name]);
			}
		}

		if (this.name !== "menu") buttons.push([back]);
		return buttons;
	}

	keyboard() {
		return {
			resize_keyboard: this.resize_keyboard,
			keyboard: this.buttons,
		};
	}
}
