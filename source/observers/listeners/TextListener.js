import { BaseListener } from "../../../stores/observers/listeners/ListenersManager.js";

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
		if (!this.message.text) return;
		if (!this.user.data.tokenGPT)
			return this.replyWithReplica("unregistered_openai_token");

		const openai = this.inquirer.services
			.getManager("api")
			.getModule("openai");

		const msg = await this.replyWithReplica("wait_responce");
		console.log(msg);

		const answer = await openai.completion({
			...this.user.openai,
			prompt: `${this.user.data.intro}\n\n${this.message.text}`,
		});

		await this.reply(answer);
	}
}
