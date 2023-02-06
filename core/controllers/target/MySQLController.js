import { BaseController } from "../../base/BaseController.js";

export default class ModulesController extends BaseController {
	constructor(inquirer, config) {
		super(
			inquirer,
			{
				name: "mysql",
				target: inquirer.mysql,
				emitters: [
					"connected",
					"connected_error",
					"load_tables_error",
					"table_init",
					"table_init_error",
					"table_error",
				],
			},
			config
		);
	}

	connected() {
		this.inquirer.logger.debug(this.name, "Database successfully connected");
	}

	connected_error(error) {
		this.inquirer.logger.fatal(this.name, "Failed to connect:", error);
	}

	load_tables_error(error) {
		this.inquirer.logger.fatal(this.name, "Failed to load tables:", error);
	}

	table_init(name) {
		this.inquirer.logger.debug(
			this.name,
			`Succussfully loaded table '${name}'`
		);
	}

	table_init_error(error) {
		this.inquirer.logger.fatal(this.name, "Table initialize error:", error);
	}

	table_error(error) {
		this.inquirer.logger.error(this.name, "Table error:", error);
	}
}
