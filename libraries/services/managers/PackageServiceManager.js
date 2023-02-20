import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BasePackageService } from "../base/BasePackageService.js";

/**
 * Package service manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export class PackageServiceManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			name: "packages",
			module: { name: "package", base: BasePackageService },
			...properties,
		});
	}
}
