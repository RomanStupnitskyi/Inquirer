import { BaseModule } from "../../../utils/base/BaseModule.js";

/**
 * Base package service
 * @since 0.0.1
 * @extends BaseModule
 */
export class BasePackageService extends BaseModule {
	constructor(inquirer, parameters = {}) {
		super(
			inquirer,
			{
				config: {
					dependent: false,
					useExecutor: false,
				},
				options: [
					{
						id: "name",
						required: true,
						unique: true,
					},
				],
			},
			parameters
		);
	}
}
