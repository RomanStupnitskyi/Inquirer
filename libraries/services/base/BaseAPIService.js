import { BaseModule } from "../../../utils/base/BaseModule.js";

/**
 * Base API service class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseAPIService extends BaseModule {
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
					{
						id: "url",
						required: true,
						unique: true,
					},
				],
			},
			parameters
		);
	}
}
