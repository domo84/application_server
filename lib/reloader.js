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
		const socket = IO.connect("http://" + this.env.live_reload);
		socket.on("connect", function()
		{
			socket.emit("reload", "web");
			socket.close();
		});
	}
}

module.exports = Reloader;
