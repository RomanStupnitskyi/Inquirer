import { BaseMiddleware } from "../../../libraries/observers/base/BaseMiddleware.js";

/**
 * Middleware class to handle hears
 * @since 0.0.1
 * @extends Middleware
 */
export default class HearsHandlerMiddleware extends BaseMiddleware {
	constructor(inquirer) {
		super(inquirer, {
			name: "buttonsHandler",
		});
	}

	/**
	 * Run method
	 * @param {*} ctx Message context
	 * @param {*} next Function to execute next contextHandlers
	 * @returns null
	 */
	async run(ctx, next) {
		if (!ctx.message || !ctx.message.text) return next();
		const hearText = ctx.message.text;

		const hear = this.inquirer.pieces.hears.getByValue((hear) =>
			hear.contents.includes(hearText)
		);
		const isOwner =
			ctx.user.isOwner && this.inquirer.constants.owners.useHiddenPieces;
		if (!hear || (hear.hidden && !isOwner)) {
			return next();
		}
		ctx["hear"] = hear;
		return await hear.execute(ctx);
	}
}
