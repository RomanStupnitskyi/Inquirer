import { Collection } from "./Collection.js";

/**
 * The modules store
 * @since 0.0.1
 * @extends Collection
 */
export class Store extends Collection {
	constructor(values) {
		super(values);
		this.cache = new Collection();
	}
}
