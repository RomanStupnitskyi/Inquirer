import { join } from "node:path";
import session from "@telegraf/session";

export default {
	// Telegram Bot Token
	token: process.env.CLIENT_TOKEN || "",

	// OpenAI config
	openAI: {
		token: process.env.OPENAI_TOKEN || "",
		about: "You are telegram bot with name Inquirer.",
		defaultOptions: {
			model: "text-davinci-003",
			prompt: "What is AI?",
			temperature: 0,
			n: 1,
		},
	},

	// Use Telegraf commands
	telegrafCommands: false,

	// Use Telegraf hears
	telegrafHears: false,

	// Default middlewares
	middlewares: [session()],

	// Owner config
	owners: {
		ids: [940147746, 1468932710], // Array of owners in format id
		ignoreCooldown: true, // Cooldown will be ignored for owners
		useHiddenPieces: true, // Owners can use hidden pieces
	},

	// Default library parameters
	library: {
		name: "library",
		dependent: false,
	},

	// Default controller parameters
	controllers: {
		name: "controllers",
		target: null,
		construction: true,
	},

	listeners: {
		name: "listeners",
		once: false,
		cooldown: {
			count: 0,
			duration: 0,
		},
	},

	commands: {
		name: "commands",
		cooldown: {
			count: 0,
			duration: 0,
		},
	},

	// Default module parameters
	services: {
		name: "services",
	},

	// Default button parameters
	button: {
		id: "button",
		useHear: true,
	},

	// Default keyboard parameters
	keyboard: {
		name: "keyboard",
		resize_keyboard: true,
		hidden: false,
	},

	// Default language
	defaultLanguage: "en",

	// Application paths
	paths: {
		root: _str2path("./source/"),
		services: _str2path("./source/services/"),
		components: _str2path("./source/components/"),
		observers: _str2path("./source/observers/"),
		pieces: _str2path("./source/pieces/"),
		dbTables: _str2path("./core/database/tables/"),
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
