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
				id: "VARCHAR(10) NOT NULL",
				tokenGPT: "VARCHAR(51) DEFAULT NULL",
				temperature: "INT(100) DEFAULT 0",
				language: "VARCHAR(2) DEFAULT 'en'",
			},
		});
	}
}
