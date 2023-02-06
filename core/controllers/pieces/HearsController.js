import { BaseController } from "../../base/BaseController.js";

export default class HearsController extends BaseController {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "hear",
				type: "module",
				emitters: ["log", "run_error"],
			},
			config
		);
	}

	log(ctx) {
		const firstName = ctx.message.from.first_name
			? ctx.message.from.first_name
			: "";
		const lastName = ctx.message.from.last_name
			? `${ctx.message.from.last_name} `
			: "";
		const username = ctx.message.from.username
			? `@${ctx.message.from.username}:`
			: "";
		this.inquirer.logger.info(
			this.title,
			`${firstName} ${lastName}(${username}${ctx.message.from.id}): ${ctx.message.text}`
		);
	}
}
