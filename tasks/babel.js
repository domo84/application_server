"use strict";

const fs = require("fs");
const spawnSync = require("child_process").spawnSync;

class Babel
{
	constructor(env)
	{
		this.logs = {
			"stdout": env.paths.log + "/babel_out.log",
			"stderr": env.paths.log + "/babel_error.log"
		};

		this.env = env;
	}

	run()
	{
		let entry = process.cwd() + "/" + this.env.config.main;
		let exit = this.env.paths.gen + "/scripts.js";

		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");
		
		let cmd = "./scripts/babel_dev.sh";

		if(!fs.existsSync(cmd))
		{
			if(this.env.type == "dev")
			{
				cmd = process.cwd() + "/node_modules/application_server/scripts/babel_dev.sh";
			}
			else
			{
				cmd = process.cwd() + "/node_modules/application_server/scripts/babel_prod.sh";
			}
		}

		let opts = {
			cwd: this.env.paths.cmd,
			stdio: ["ignore", out, err]
		};

		let result = spawnSync(cmd, ["-e", entry, "-o", exit, "--bare"], opts);

		return result.status === 0 ? true : false;
	}
}

module.exports = Babel;
