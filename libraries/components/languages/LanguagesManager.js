import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";
import { Collection } from "../../../extensions/Collection.js";

/**
 * Languages' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class LanguagesManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "language", baseclass: BaseLanguage },
			...properties,
		});
	}

	/**
	 * Get all languages replics by key
	 * @param {*} key The replic's key
	 * @returns Replics array
	 */
	getAllReplics(key = "") {
		let replics = [];
		for (const language of this.modules.values()) {
			const replica = language.getLocalReplica(key);
			if (replica) replics.push(replica);
		}
		return replics;
	}
}

/**
 * Language base class
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
		this.keys = new Collection();
		this.localKeys = new Collection();
	}

	_prepare() {
		try {
			// Handle local keys
			if (!this._localKeys)
				return this._logger.fatal("Getter '_localKeys' is not exists");
			this.localKeys.setMany(this._localKeys);

			// Handle keys
			if (!this._keys)
				return this._logger.warn("Getter '_keys' is not exists");
			this.keys.setMany(this._keys);
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
		let replica = this.localKeys.get(key);
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
		let replica = this.keys.get(key);
		if (!replica) {
			if (this.name === this.inquirer.constants.defaultLanguage)
				return undefined;
			replica = this.inquirer.components
				.getManager("languages")
				.get(this.inquirer.constants.defaultLanguage)
				.get(key);
		}
		if (replica?.constructor?.name === "Function") replica = replica(...args);
		return replica || undefined;
	}
}
