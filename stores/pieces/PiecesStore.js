import { BaseStore } from "../../core/structures/BaseStore.js";

/**
 * Pieces store class
 * @since 0.0.1
 * @extends BaseStore
 */
export class PiecesStore extends BaseStore {
	constructor(inquirer, properties = {}) {
		super(inquirer, properties);
	}
}
