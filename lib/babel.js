"use strict";

const fs = require("fs");
const spawn = require("child_process").spawn;

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
		let exit = this.env.paths.html + "/scripts.js";

		let cmd = "./node_modules/.bin/browserify";
		let args = [entry, "-o", exit, "-t", "babelify"];

		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");

		spawn(cmd, args, { stdio: ["ignore", out, err] });
	}
}

module.exports = Babel;
