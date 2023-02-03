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

	// Default language
	defaultLanguage: "en",

	// Default parameters
	defaultParameters: {
		// Default library parameters
		library: {
			baseName: "library",
			dependent: false,
		},

		// Default controller parameters
		controllers: {
			baseName: "controller",
			target: null,
			construction: true,
		},

		// Default listeners parameters
		listeners: {
			baseName: "listener",
			once: false,
			cooldown: {
				count: 0,
				duration: 0,
			},
		},

		// Default middlewares parameters
		middlewares: {
			baseName: "middleware",
		},

		// Default commands parameters
		commands: {
			baseName: "command",
			cooldown: {
				count: 0,
				duration: 0,
			},
		},

		// Default hears parameters
		hears: {
			baseName: "hear",
		},

		// Default buttons parameters
		buttons: {
			baseName: "button",
			useHear: true,
		},

		// Default keyboards parameters
		keyboards: {
			baseName: "keyboard",
			resize_keyboard: true,
			hidden: false,
		},

		// Default keyboards parameters
		languages: {
			baseName: "language",
		},

		// Default api parameters
		api: {
			baseName: "api",
		},

		// Default packages parameters
		packages: {
			basename: "packages",
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
