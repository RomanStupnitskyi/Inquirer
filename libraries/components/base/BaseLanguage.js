import { Collection } from "../../../utils/Collection.js";
import { BaseModule } from "../../../utils/base/BaseModule.js";

/**
 * Base language class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseLanguage extends BaseModule {
	#keys;
	#localKeys;

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
						type: String,
						required: true,
						unique: true,
					},
				],
			},
			parameters
		);
		this.#localKeys = new Collection();
		this.#keys = new Collection();
	}

	/**
	 * Initialize the language component
	 * @since 0.0.1
	 */
	prepare() {
		try {
			// Load lccal keys
			if (!this.localKeys) return this.controller.emit("local_keys_error");
			this.#localKeys.setMany(this.localKeys);

			// Load keys
			if (!this.keys) return this.controller.emit("keys_error");
			this.#keys.setMany(this.keys);
		} catch (error) {
			this.controller.emit("init_error", error);
		}
	}

	getLocalKey(key = "", ...args) {
		let replica = this.#localKeys.get(key);
		if (!replica) return this.controller.emit("get_local_key_error");
		if (replica?.constructor?.name === "Function") replica = replica(...args);
		return replica;
	}

	/**
	 * Get language replic
	 * @since 0.0.1
	 * @param {*} key Identifier of replic
	 * @param  {...any} args Some args to get replic
	 * @returns Replica or undefined
	 */
	getKey(key = "", ...args) {
		let replica = this.#keys.get(key);
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
