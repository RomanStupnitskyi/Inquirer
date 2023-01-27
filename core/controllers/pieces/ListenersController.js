import { BaseController } from "../../../utils/base/BaseController.js";

export default class ListenersController extends BaseController {
	constructor(inquirer, listener) {
		super(
			inquirer,
			{
				name: "listeners",
				construction: false,
				emitters: ["log", "run_error"],
			},
			listener
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
