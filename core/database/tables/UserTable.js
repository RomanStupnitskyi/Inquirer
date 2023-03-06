import { BaseTable } from "../base/BaseTable.js";

/**
 * Table user
 * @since 0.0.1
 * @extends Table
 */
export default class UserTable extends BaseTable {
	constructor(inquirer, connection) {
		super(inquirer, connection, {
			name: "user",
			statement: {
				id: {
					type: "varchar",
					count: 10,
					default: "not null",
				},
				roles: {
					type: "json",
				},
				tokenGPT: {
					type: "varchar",
					count: 51,
					default: "null",
				},
				temperature: {
					type: "int",
					count: 100,
					default: 0,
				},
				language: {
					type: "varchar",
					count: 2,
					default: "en",
				},
			},
		});
	}
}
