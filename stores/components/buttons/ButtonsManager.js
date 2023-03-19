import { BaseManager } from "../../../core/structures/BaseManager.js";
import { BaseModule } from "../../../core/structures/BaseModule.js";

/**
 * Buttons' manager class
 * @since 0.0.1
 * @extends BaseManager
 */
export default class ButtonsManager extends BaseManager {
	constructor(inquirer, properties = {}) {
		super(inquirer, {
			module: { basename: "button", baseclass: BaseButton },
			...properties,
		});
	}
}

/**
 * Base button class
 * @since 0.0.1
 * @extends BaseModule
 */
export class BaseButton extends BaseModule {
	constructor(inquirer, optionsArguments, properties = {}) {
		super(inquirer, {
			useExecutor: true,
			executeLog: true,
			options: [
				{
					id: "label",
					type: String,
					unique: true,
					default: "",
				},
				{
					id: "fixed",
					type: Boolean,
					default: false,
				},
				{
					id: "byLanguageKey",
					type: Boolean,
					default: false,
				},
			],
			optionsArguments,
			...properties,
		});
	}

	log(context) {
		const fullName = context.user.fullName;
		const username = context.user.username
			? `@${context.user.username}`
			: "@invalid_user";
		if (context.message)
			this._logger.debug(
				`${fullName} (${username}:${context.user.id}): ${context.message.text}`
			);
		else
			this._logger.debug(
				`${fullName} (${username}:${context.user.id}): pushed the button`
			);
	}

	initialize() {
		if (this.inquirer.constants.telegrafHears) {
			const labels = this.byLanguageKey
				? [
						this.inquirer.components
							.getManager("languages")
							.getAllReplics(this.name),
				  ]
				: [this.label];
			if (this.lablel) labels.push(this.label);
			this.inquirer["hears"](labels, this.execute);
		}

		if (this.inquirer.constants.telegrafButtons) {
			const labels = this.byLanguageKey
				? [
						this.inquirer.components
							.getManager("languages")
							.getAllReplics(this.name),
				  ]
				: [this.label];
			if (this.label) labels.push(this.label);
			for (const label of labels)
				this.inquirer["action"](label, this.execute);
		}
	}
}
