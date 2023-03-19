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

	initialize() {
		try {
			// Handle local keys
			if (!this._localKeys)
				return this._logger.fatal("Getter '_localKeys' is not exists");
			for (const [key, value] of Object.entries(this._localKeys))
				this.localKeys.set(key, value);

			// Handle keys
			if (!this._keys)
				return this._logger.warn("Getter '_keys' is not exists");
			for (const [key, value] of Object.entries(this._keys))
				this.keys.set(key, value);
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

	/**
	 * Check language has replica
	 * @param {*} replica The language replica
	 * @returns Boolean
	 */
	hasReplica(replica = "") {
		return [...this.keys.values()].includes(replica);
	}

	/**
	 * Check language has local replica
	 * @param {*} replica The language local replica
	 * @returns Boolean
	 */
	hasLocalReplica(replica = "") {
		return [...this.localKeys.values()].includes(replica);
	}
}
