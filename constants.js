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
	// Folder will be created if not exists
	folderEnsure: true,
	// Use Telegraf commands (for example, client.command(name, callback))
	telegrafCommands: false,
	// Use Telegraf hears (for example, client.hears(name, callback))
	telegrafHears: false,
	// Use Telegraf buttons (for example, client.action(name, callback))
	telegrafButtons: false,
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
	store: {
		assignManagersToClass: true, // Assign store's managers to the store
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
			date: chalk.gray.italic,
			type: chalk.cyan,
			title: chalk.cyan,
			message: chalk.white,
		},
		complete: {
			date: chalk.gray.italic,
			type: chalk.magenta,
			title: chalk.magenta,
			message: chalk.greenBright,
		},
		warn: {
			date: chalk.gray.italic,
			type: chalk.hex("#DEC11E"),
			title: chalk.hex("#DEC11E"),
			message: chalk.white,
		},
		error: {
			date: chalk.gray.italic,
			type: chalk.red,
			title: chalk.red,
			message: chalk.white,
		},
		fatal: {
			date: chalk.gray.italic,
			type: chalk.red,
			title: chalk.red,
			message: chalk.red,
		},
	},
	// Core paths
	paths: {
		root: _str2path("./"),
		core: _str2path("./core"),
		source: _str2path("./source/"),
		stores: _str2path("./stores"),
		dbTables: _str2path("./core/database/tables/"),
	},
	// Database config
	database: {
		countableTypes: ["VARCHAR", "CHAR"],
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
