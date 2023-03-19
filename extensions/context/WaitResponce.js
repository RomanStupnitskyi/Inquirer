export class WaitResponce {
	constructor(context, parameters) {
		this.context = context;
		this._parameters = parameters;

		setTimeout(destroy, parameters.duration * 1000);
	}

	destroy() {
		delete this.context.session.waitResponce;
		this.context.replyWithReplica("timeToAnswerIsOver");
	}
}
