/**
 * Advanced Map with additional functionality
 * @extends Map
 */
export class Collection extends Map {
	/**
	 * Creates a new Collection instance.
	 * @param {Object} options - Optional parameters for the Collection.
	 * @param {boolean} options.assignProperties - Whether to assign elements to the Collection instance as properties.
	 * @param {Object} values - The initial elements of the Collection.
	 */
	constructor(options = { assignProperties: false }, values = {}) {
		if (typeof values !== "object") {
			throw new TypeError("Values must be an object");
		}

		super(values[Symbol.iterator] ? [...values] : Object.entries(values));
		Object.defineProperty(this, "_options", {
			value: options,
			writable: false,
			enumerable: false,
			configurable: false,
		});
	}

	/**
	 * Get an element from the Collection by value.
	 * @param {*} options - The element options or callback.
	 * @returns {*} The element or undefined.
	 */
	getByValue(options = null) {
		if (!options) {
			return undefined;
		}

		const isFunction = typeof options === "function";
		for (const value of this.values()) {
			if (isFunction && options(value)) {
				return value;
			}

			if (
				typeof options === "object" &&
				Object.entries(options).every(([key, val]) => value[key] === val)
			) {
				return value;
			}
		}

		return undefined;
	}

	/**
	 * Check if the Collection has an element by value.
	 * @param {*} options - The element options.
	 * @returns {boolean} True if an element exists with the specified value, false otherwise.
	 */
	hasByValue(options) {
		const element = this.getByValue(options);
		return ["boolean", "number", "string"].includes(typeof element)
			? true
			: !!element;
	}

	/**
	 * Add an element to the Collection.
	 * @param {*} key - The element identifier.
	 * @param {*} value - The element value.
	 */
	set(key, value) {
		super.set(key, value);
		if (this._options.assignProperties && typeof key === "string") {
			this[key] = value;
		}
	}

	/**
	 * Delete an element from the Collection.
	 * @param {*} key - The element identifier.
	 * @returns {*} The deleted element or undefined.
	 */
	delete(key) {
		const element = this.get(key);
		if (
			element &&
			this._options.assignProperties &&
			typeof key === "string"
		) {
			super.delete(key);
			delete this[key];
		}

		return element;
	}

	/**
	 * Filter the elements of the Collection.
	 * @param {Function} callback - A function that returns a boolean value.
	 * @returns {Collection} A new Collection instance with filtered elements.
	 */
	filter(callback) {
		const filtered = new this[Symbol.species](this._options);
		for (const [key, value] of this.entries()) {
			if (callback(value)) {
				switch (this[Symbol.species]) {
					case Collection:
						filtered.set(key, callback(value));
						break;

					case Array:
						filtered.push([key, value]);
						break;

					default:
						filtered[key] = value;
				}
			}
		}

		return filtered;
	}

	/**
	 * Map the elements of the Collection.
	 * @param {Function} callback - A function that maps the elements.
	 * @returns {Collection} A new Collection instance with mapped elements.
	 */
	map(callback) {
		const mapped = new Collection(this._options);
		for (const [key, value] of this.entries()) {
			switch (this[Symbol.species]) {
				case Collection:
					mapped.set(key, callback(value));
					break;

				case Array:
					mapped.push([key, value]);
					break;

				default:
					mapped[key] = value;
			}
		}

		return mapped;
	}

	/**
	 * Get element by identifier or callback.
	 * @param {*} parameters - The element identifier or callback function.
	 * @returns The finded element or undefined.
	 */
	get(parameters) {
		const constructor = parameters?.constructor?.name;
		if (constructor === "Function") {
			for (const value of this.values()) {
				const exists = parameters(value);
				if (exists) return value;
			}
		} else return super.get(parameters);
		return undefined;
	}

	/**
	 * Formatting collection to object.
	 * @returns Object as collection parameters in format { key: value }.
	 */
	toObject() {
		return Object.fromEntries(this);
	}

	/**
	 * Formatting collection to array.
	 * @returns Array in format [[key, value], ...].
	 */
	toArray() {
		return Array.from(this);
	}

	static get [Symbol.species]() {
		return Collection;
	}
}
