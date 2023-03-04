import { BaseListener } from "../../../libraries/observers/listeners/ListenersManager.js";

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
