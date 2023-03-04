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
			options: [
				{
					id: "labels",
					type: Array,
					unique: true,
					default: [],
				},
				{
					id: "useHear",
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

	_prepare() {
		if (this.useHear && this.inquirer.constants.telegrafHears) {
			const labels = this.byLanguageKey
				? [
						...this.lables,
						this.inquirer.components
							.getManager("languages")
							.getAllReplics(this.name),
				  ]
				: this.labels;
			this.inquirer["hears"](labels, this.execute);
		}

		if (this.inquirer.constants.telegrafButtons) {
			const labels = this.byLanguageKey
				? [
						...this.lables,
						this.inquirer.components
							.getManager("languages")
							.getAllReplics(this.name),
				  ]
				: this.labels;
			for (const label of labels)
				this.inquirer["action"](label, this.execute);
		}
	}
}
