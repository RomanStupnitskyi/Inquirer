import { BaseController } from "../../../utils/base/BaseController.js";

export default class MiddlewaresController extends BaseController {
	constructor(inquirer, middleware) {
		super(
			inquirer,
			{
				name: "middleware",
				construction: false,
				emitters: ["log", "run_error"],
			},
			middleware
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
