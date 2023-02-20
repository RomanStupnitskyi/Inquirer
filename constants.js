import { join } from "node:path";
import chalk from "chalk";
import session from "@telegraf/session";

export default {
	// Telegram Bot Token
	token: process.env.CLIENT_TOKEN || "",
	// OpenAI config
	openAI: {
		defaultOptions: {
			model: "text-davinci-003",
			prompt: "What is AI?",
			temperature: 0.1,
			n: 1,
		},
	},
	// Use Telegraf commands (for example, client.command(name, callback))
	telegrafCommands: false,
	// Use Telegraf hears (for example, client.hears(name, callback))
	telegrafHears: false,
	// Default middlewares
	middlewares: [session()],
	// Owners config
	owners: {
		ids: [940147746, 1468932710], // Owners ids
		ignoreCooldown: true, // Cooldown will be ignored for owners
		useHiddenModules: true, // Owners can use hidden modules
	},
	// Default language
	defaultLanguage: "en",
	// Library parameters
	library: {
		managerFolderName: "managers",
	},
	// Module default options
	moduleDefaultOptions: [
		{
			id: "name",
			type: String,
			required: true,
			unique: true,
		},
		{
			id: "executeLog",
			type: Boolean,
			required: false,
			unique: false,
			default: false,
		},
	],
	// Logger config
	logger: {
		showDate: true,
		showType: true,
		debug: {
			date: chalk.gray,
			type: chalk.bgCyan.bold,
			title: chalk.cyan,
			message: chalk.white,
		},
		warn: {
			date: chalk.gray,
			type: chalk.bgHex("#DEC11E").bold,
			title: chalk.hex("#DEC11E"),
			message: chalk.white,
		},
		error: {
			date: chalk.gray,
			type: chalk.bgRed,
			title: chalk.red,
			message: chalk.red,
		},
		fatal: {
			date: chalk.gray,
			type: chalk.bgRed,
			title: chalk.red,
			message: chalk.red,
		},
	},
	// Core paths
	corePaths: {
		root: _str2path("./"),
		libraries: _str2path("./libraries"),
		core: _str2path("./core"),
	},
	// Source paths
	paths: {
		root: _str2path("./source/"),
		dbTables: _str2path("./core/database/tables/"),
		services: _str2path("./source/services/"),
		components: _str2path("./source/components/"),
		observers: _str2path("./source/observers/"),
		pieces: _str2path("./source/pieces/"),
	},
	// Database config
	database: {
		name: process.env.db_name || "",
		host: process.env.db_host || "",
		port: process.env.db_port || "",
		user: process.env.db_user || "",
		password: process.env.db_password || "",
	},
};

function _str2path(str) {
	return join(process.cwd(), str);
}
