/**
 * Advanced Map with additional functional
 * @extends Map
 */
export class Collection extends Map {
	#presave;
	#set;
	/**
	 * @param {*} values Array of arrays with format [key, value]
	 */
	constructor(values) {
		super(Collection._isConvertible(values) ? values : []);
	}

	async getByValue(options = null) {
		if (!options) return undefined;
		let item;

		const constructor = options?.constructor?.name;
		if (constructor) {
			for (const [key, value] of this.entries) {
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
		for (const [name, element] of this.entries()) {
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
			for (const [key, value] of this.entries) {
				const result = options(value);
				if (result) return true;
			}
		}
		for (const [name, element] of this.entries()) {
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
	getMany(keys) {
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
		if (!Collection._isConvertible(values)) throw new TypeError();
		values = Object.entries(values);

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
		const collection = new Collection();
		for (let [key, value] of entries) {
			if (callback(value)) collection.set(key, value);
			else continue;
		}
		return collection;
	}

	/**
	 * Async filter of parameters of collection
	 * @param {*} callback AsyncFunction that returns Boolean value
	 * @returns New Collection with filtered parameters
	 */
	async asyncFilter(callback) {
		const entries = this.entries();
		const collection = new Collection();
		for (let [key, value] of entries) {
			if (await callback(value)) collection.set(key, value);
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
		const collection = new Collection();
		for (let [key, value] of entries) {
			collection.set(key, callback(value));
		}
		return collection;
	}

	/**
	 * Async map that mapping parameters of collection
	 * @param {*} callback AsyncFunction that returns Boolean value
	 * @returns New Collection with mapping parameters
	 */
	async asyncMap(callback) {
		const entries = this.entries();
		const collection = new Collection();
		for (let [key, value] of entries) {
			collection.set(key, await callback(value));
		}
		return collection;
	}

	/**
	 * Formatting collection to object
	 * @returns Object as collection parameters in format { key: value }
	 */
	toObject() {
		return Object.fromEntries(this);
	}

	/**
	 * Check the values is convertable to add to the collection
	 * @param {*} values Must be an Array with arrays in format [key, value]
	 * @returns Boolean value
	 */
	static _isConvertible(values) {
		return typeof values === "object" && !values[Symbol.iterator];
	}
}
