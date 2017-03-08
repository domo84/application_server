"use strict";

const fs = require("fs");
const spawnSync = require("child_process").spawnSync;

class Sass
{
	constructor(env)
	{
		this.logs = {
			"stdout": env.paths.log + "/sass_out.log",
			"stderr": env.paths.log + "/sass_error.log"
		};

		this.env = env;
	}

	run()
	{
		let entry = process.cwd() + "/src/scss/main.scss";
		let exit = this.env.paths.gen + "/styles.css";

		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");

		let cmd = "./node_modules/.bin/node-sass";
		let opts = {
			cwd: this.env.paths.cmd,
			stdio: ["ignore", out, err]
		};

		let result = spawnSync(cmd, [entry, exit], opts);

		if(result.status === 0)
		{
			return true;
		}

		return false;
	}
}

module.exports = Sass;
