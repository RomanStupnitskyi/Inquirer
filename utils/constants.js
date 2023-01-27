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
	libraryDefault: {
		name: "library", // String identifier
		dependent: false, // Library modules are dependent of some object (must save as class)
	},

	// Default controller parameters
	controllerDefault: {
		name: "controller", // String identifier
		target: null, // Target of controller
		construction: true, // Controller is constructor (used with new in load)
	},

	// Default module parameters
	serviceDefault: {
		name: "module", // String identifier
		preserve: false, // Save module to Telegram bot client "Inquirer"
		useContext: false, // Module can be used with ContextHandlers
		enabled: true, // Module is enabled if true
	},

	// Default piece parameters
	pieceDefault: {
		name: "piece", // String identifier
		description: "I have any word about that...", // Description of piece
		cooldown: {
			duration: 0,
			count: 0,
		},
	},

	// Default button parameters
	buttonDefault: {
		id: "button",
		useHear: true,
	},

	// Default keyboard parameters
	keyboardDefault: {
		name: "keyboard",
		resize_keyboard: true,
		hidden: false,
	},

	// Default language
	defaultLanguage: "en",

	// Application paths
	paths: {
		root: _str2path("./source/"),
		modules: _str2path("./source/modules/"),
		controllers: _str2path("./source/controllers/"),
		components: _str2path("./source/components/"),
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
