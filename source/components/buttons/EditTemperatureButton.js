import { BaseButton } from "../../../stores/components/buttons/ButtonsManager.js";

export default class EditTemperature extends BaseButton {
	constructor(inquirer, properties) {
		super(
			inquirer,
			{
				name: "edit_temperature",
				label: "Edit temperature",
				useHear: true,
				byLanguageKey: true,
			},
			properties
		);
	}

	async _run(temperature) {
		if (!temperature) return await this.replyWithReplica("enterTemperature");
		if (temperature < 0 || temperature > 100)
			return await this.replyWithReplica("temperatureRangeError");

		await this.user.update({ temperature });
		await this.replyWithReplica({
			key: "temperatureEdited",
			args: [temperature],
		});
	}
}
