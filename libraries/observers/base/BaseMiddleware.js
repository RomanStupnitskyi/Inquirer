import { BaseModule } from "../../../utils/base/BaseModule.js";

/**
 * Base middleware class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseMiddleware extends BaseModule {
	constructor(inquirer, parameters = {}) {
		super(
			inquirer,
			{
				config: {
					dependent: true,
					useExecutor: true,
				},
				options: [
					{
						id: "name",
						type: String,
						required: true,
						unique: true,
					},
					{
						id: "stable",
						type: Boolean,
						default: false,
					},
				],
			},
			parameters
		);
	}

	/**
	 * Initialize the middleware
	 * @since 0.0.1
	 * @returns Current middleware class
	 */
	initialize() {
		const _execute = async function (...args) {
			const middleware = this.inquirer.pieces.middlewares.get(this.name);
			if (middleware) await this["execute"](...args);
			else return false;
		};
		this.inquirer["use"](_execute.bind(this));
		return this;
	}
}
