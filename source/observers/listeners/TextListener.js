import { BaseListener } from "../../../libraries/observers/base/BaseListener.js";

export default class TextListener extends BaseListener {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "text",
			},
			properties
		);
	}

	async _run() {
		await this.reply(this.message.text);
	}
}
