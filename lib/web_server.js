"use strict";

const fs = require("fs");
const spawn = require("child_process").spawn;

class WebServer
{
	constructor(env)
	{
		this.logs = {
			"stdout": env.paths.log + "/web_server_out.log",
			"stderr": env.paths.log + "/web_server_error.log"
		};
		this.env = env;
	}

	start()
	{
		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");

		let cmd = "php";
		let args = ["-S", "0.0.0.0:8080", "-t", this.env.paths.html];
		let web_server = spawn(cmd, args, { detached: false, stdio: ["ignore", out, err] });
		web_server.unref();
		return web_server;
	}

	stop()
	{
		try
		{
			let pid = this.env.pids.web_server;
			process.kill(pid);
			console.log("stop", "web_server", pid);
		}
		catch(e)
		{
		}
	}
}

module.exports = WebServer;
