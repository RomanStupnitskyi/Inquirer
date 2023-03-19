import Centra from "centra";
import { BaseAPIService } from "../../../stores/services/api/APIServiceManager.js";

/**
 * Class OpenAI for working with OpenAI API
 * @since 0.0.1
 * @extends BaseAPIService
 */
export default class OpenAIService extends BaseAPIService {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "openai",
				url: "https://api.openai.com/v1",
			},
			properties
		);

		this._config = this.inquirer.constants.openAI.defaultOptions;
	}

	/**
	 * Generate completion to question
	 * @param {*} options Some options to castomize completion
	 * @returns Completion result
	 */
	async completion(options = this.defaultOptions) {
		try {
			options = Object.assign(this._config, options);
			options[
				"prompt"
			] = `${this.inquirer.constants.openAI.about}\nSend me only answer to text: "${options["prompt"]}". If your answer has code, wrap only the code in \`\`\`, else don't wrap the text in \`\`\``;

			if (!options["user"]) delete options["user"];
			const request = await Centra(
				"https://api.openai.com/v1/completions",
				"POST"
			)
				.header({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.inquirer.constants.openAI.token}`,
				})
				.body({
					...options,
					max_tokens: 4096 - options.prompt.length,
				})
				.send();
			return JSON.parse(await request.text());
		} catch (error) {
			this.controller.emit("completion_error", error);
			return { error };
		}
	}
}
