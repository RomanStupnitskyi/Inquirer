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
				modelGPT: {
					type: "varchar",
					count: 30,
					default: "text-davinci-003",
				},
				temperature: {
					type: "int",
					count: 100,
					default: 0,
				},
				intro: {
					type: "varchar",
					count: 2000,
					default:
						"In answer wrap only the code in ```, if there is no code in the answer, don't do it.",
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
