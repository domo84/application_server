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
		let entry = process.cwd() + "/src/es2017/app.js";
		let exit = this.env.paths.gen + "/scripts.js";

		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");
		
		let cmd = "./scripts/babel.sh";

		if(!fs.existsSync(cmd))
		{
			cmd = "./node_modules/domo_as/scripts/babel.sh";
		}

		let opts = {
			cwd: this.env.paths.cmd,
			stdio: ["ignore", out, err]
		};

		let result = spawnSync(cmd, [entry, exit], opts);

		return result.status === 0 ? true : false;
	}
}

module.exports = Babel;
