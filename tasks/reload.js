"use strict";

const fs = require("fs");
const IO = require("socket.io-client");

class Reloader
{
	constructor()
	{

	}

	reload()
	{
		try
		{
			const config = this.getConfig();
			const socket = IO.connect(config.address);
			socket.emit("reload", config.room);
			socket.close();
		}
		catch(e)
		{
			// Silent because it might be unconfigured by user choice.
			// console.error("RELOAD not setup", e);
		}
	}

	getConfig()
	{
		let contents = fs.readFileSync(process.cwd() + "/package.json", "utf8");
		contents = JSON.parse(contents);

		if(contents.application_server === undefined)
		{
			throw new Error("Missing 'application_server' settings");
		}

		const config = contents.application_server.reload;
		
		if(config === undefined)
		{
			throw new Error("Missing 'reload' settings");
		}
		else if(!config.room || !config.host || !config.port)
		{
			throw new Error("Missing either 'room', 'host' or 'port' settings");
		}

		config.address = "http://" + config.host + ":" + config.port;

		return config;
	}
}

module.exports = Reloader;
