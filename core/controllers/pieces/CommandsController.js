import { BaseController } from "../../../utils/base/BaseController.js";

export default class CommandsController extends BaseController {
	constructor(inquirer, command) {
		super(
			inquirer,
			{
				name: "command",
				construction: false,
				emitters: ["log", "run_error"],
			},
			command
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
