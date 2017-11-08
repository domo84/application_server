"use strict";

const IO = require("socket.io-client");

class Reloader
{
	constructor(env)
	{
		this.env = env;
	}

	reload()
	{
		const socket = IO.connect(this.env.live_reload);
		socket.emit("reload", "web");
		socket.close();
	}
}

module.exports = Reloader;
