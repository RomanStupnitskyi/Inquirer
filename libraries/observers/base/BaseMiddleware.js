import { BaseModule } from "../../../core/base/BaseModule.js";

/**
 * Base middleware class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseMiddleware extends BaseModule {
	constructor(inquirer, parameters = {}, config = { production: true }) {
		super(
			inquirer,
			{
				config: {
					dependent: false,
					useExecutor: true,
					...config,
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
	prepare() {
		const _execute = async function (...args) {
			const middleware = this.inquirer.observers.middlewares.get(this.name);
			if (middleware) await this["execute"](...args);
			else return false;
		};
		this.inquirer["use"](_execute.bind(this));
		return this;
	}
}
