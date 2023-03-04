/**
 * Advanced Map with additional functional
 * @extends Map
 */
export class Collection extends Map {
	/**
	 * @param {*} values Array of arrays like format [key, value]
	 */
	constructor(values = {}) {
		if (typeof values !== "object")
			throw new Error("Values must be an object");
		super(values[Symbol.iterator] ? [...values] : Object.entries(values));
	}

	async getByValue(options = null) {
		if (!options) return undefined;
		let item;

		const constructor = options?.constructor?.name;
		if (constructor) {
			for (const value of this.values) {
				switch (constructor) {
					case "Function":
						if (options(value)) return value;
						break;

					case "AsyncFunction":
						if (await options(value)) return value;
						break;
				}
			}
		}
		for (const element of this.values()) {
			if (typeof options === "string") return options === i;
			const entries = Object.entries(options);
			const result = [];
			for (const [key, value] of entries) {
				if (element[key] && element[key] === value) result.push(true);
				else result.push(false);
			}
			if (result.reduce((a, b) => a && b)) item = element;
		}
		return item;
	}

	hasByValue(options = null) {
		if (!options) return false;
		let item;

		const isFunction = options?.constructor?.name;
		if (isFunction && isFunction === "Function") {
			for (const value of this.values()) {
				const result = options(value);
				if (result) return true;
			}
		}
		for (const element of this.values()) {
			if (["string", "number"].includes(typeof options)) return value === i;
			const entries = Object.entries(options);
			const result = [];
			for (const [key, value] of entries) {
				if (element[key] && element[key] === value) result.push(true);
				else result.push(false);
			}
			if (result.reduce((a, b) => a && b)) item = element;
		}
		return typeof item === "boolean" ? true : !!item;
	}

	/**
	 * Get many parameters of collection
	 * @param {*} keys Key to get value from collection
	 */
	getMany(keys = []) {
		const result = [];
		for (const key of keys) {
			result.push(this.get(key));
		}
		return result;
	}

	/**
	 * Set many parameters to collection
	 * @param {*} values Array of parameters in format [key, value]
	 * @returns The collection with new parameters
	 */
	setMany(values = {}) {
		if (typeof values !== "object")
			throw new Error("Values must be an object");
		if (values[Symbol.iterator] && !Array.isArray(values))
			values = [...values];
		if (!values[Symbol.iterator]) values = Object.entries(values);

		for (let [key, value] of values) {
			this.set(key, value);
		}
		return this;
	}

	/**
	 * Delete many parameters of collection
	 * @param {*} keys Array of parameters in format [key, value]
	 * @returns The collection without deleted parameters
	 */
	deleteMany(keys = []) {
		for (let key of keys) {
			this.delete(key);
		}
		return this;
	}

	/**
	 * Sync filter of parameters of collection
	 * @param {*} callback Function that returns Boolean value
	 * @returns New Collection with filtered parameters
	 */
	filter(callback) {
		const entries = this.entries();
		const collection = new this[Symbol.species]();
		for (let [key, value] of entries) {
			if (callback(value)) collection.set(key, value);
			else continue;
		}
		return collection;
	}

	/**
	 * Sync map that mapping parameters of collection
	 * @param {*} callback Function that returns Boolean value
	 * @returns New Collection with mapping parameters
	 */
	map(callback) {
		const entries = this.entries();
		const collection = new this[Symbol.species]();
		for (let [key, value] of entries) {
			collection.set(key, callback(value));
		}
		return collection;
	}

	find(callback) {
		for (const value of this.values()) {
			const exists = callback(value);
			if (exists) return value;
		}
		return undefined;
	}

	/**
	 * Formatting collection to object
	 * @returns Object as collection parameters in format { key: value }
	 */
	toObject() {
		return Object.fromEntries(this);
	}

	/**
	 * Formatting collection to array
	 * @returns Array in format [[key, value], ...]
	 */
	toArray() {
		return Array.from(this);
	}

	static get [Symbol.species]() {
		return Collection;
	}
}
