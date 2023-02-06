import { BaseLibrary } from "../../core/base/BaseLibrary.js";
import { BaseAPIService as api } from "./base/BaseAPIService.js";
import { BasePackageService as packageService } from "./base/BasePackageService.js";

/**
 * Library of services class
 * @since 0.0.1
 * @extends BaseLibrary
 */
export class ServicesLibrary extends BaseLibrary {
	constructor(inquirer) {
		super(inquirer, {
			name: "services",
			modules: { api, packageService },
		});
	}
}
