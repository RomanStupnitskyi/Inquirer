import { BaseModule } from "../../../core/structures/BaseModule.js";
import { Collection } from "../../../extensions/Collection.js";

/**
 * Base language class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseLanguage extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: false,
			options: [],
			optionsArguments,
			...properties,
		});
		this._keys = new Collection();
		this._localKeys = new Collection();
	}

	/**
	 * Handle language keys
	 */
	_prepare() {
		try {
			// Handle local keys
			if (!this.localKeys)
				return this._logger.fatal("Getter 'localKeys' is not exists");
			this._localKeys.setMany(this.localKeys);

			// Handle keys
			if (!this.keys)
				return this._logger.warn("Getter 'keys' is not exists");
			this._keys.setMany(this.keys);
		} catch (error) {
			this._logger.fatal(error);
		}
	}

	/**
	 * Get a replica by key
	 * @param {*} key Language key
	 * @param  {...any} args Arguments for replica
	 * @returns Replica
	 */
	getLocalReplica(key = "", ...args) {
		let replica = this._localKeys.get(key);
		if (!replica)
			return this._logger.fatal(`Local key '${key}' is not found`);
		if (replica?.constructor?.name === "Function") replica = replica(...args);
		return replica;
	}

	/**
	 * Get a replica by key
	 * @param {*} key Language key
	 * @param  {...any} args Replica arguments
	 * @returns Replica or undefined
	 */
	getReplica(key = "", ...args) {
		let replica = this._keys.get(key);
		if (!replica) {
			if (this.name === this.inquirer.constants.defaultLanguage)
				return undefined;
			replica = this.inquirer.components["languages"]
				.get(this.inquirer.constants.defaultLanguage)
				.get(key);
		}
		if (replica?.constructor?.name === "Function") replica = replica(...args);
		return replica || undefined;
	}
}
