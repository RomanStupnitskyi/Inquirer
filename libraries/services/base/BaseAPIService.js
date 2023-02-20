import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Base API service class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseAPIService extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [
				{
					id: "url",
					type: String,
					required: true,
					unique: true,
				},
			],
			optionsArguments,
			...properties,
		});
	}
}
