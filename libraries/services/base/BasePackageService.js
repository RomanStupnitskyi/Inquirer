import { BaseModule } from "../../../core/base/BaseModule.js";

/**
 * Base package service
 * @since 0.0.1
 * @extends BaseModule
 */
export class BasePackageService extends BaseModule {
	constructor(inquirer, parameters = {}, config = { production: true }) {
		super(
			inquirer,
			{
				config: {
					dependent: false,
					useExecutor: false,
					...config,
				},
				options: [
					{
						id: "name",
						type: String,
						required: true,
						unique: true,
					},
				],
			},
			parameters
		);
	}
}
