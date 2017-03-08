"use strict";

const fs = require("fs");
const spawn = require("child_process").spawn;

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
		let source = process.cwd() + "/src/scss/main.scss";
		let target = this.env.paths.gen + "/styles.css";

		let cmd = "./node_modules/.bin/node-sass";
		let args = [source, target];

		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");

		spawn(cmd, args, { cwd: this.env.paths.cmd, stdio: ["ignore", out, err] });
	}
}

module.exports = Sass;
