import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseAPIService } from "../base/BaseAPIService.js";

/**
 * API service manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class APIServiceManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "api",
			module: { name: "api", base: BaseAPIService },
			...properties,
		});
	}
}
