"use strict";

const fs = require("fs");
const exec = require("child_process").exec;

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

		let browserify = "./node_modules/.bin/browserify";
		let preset = this.env.paths.modules + "/babel-preset-env";
		let cmd = `${browserify} ${entry} -o ${exit} -t [ babelify --presets [${preset}] ]`;

		exec(cmd, { cwd: this.env.paths.cmd }, (error, stdout, stderr) =>
		{
			if(stderr)
			{
				fs.writeFile(this.logs.stderr, stderr, function()
				{
					console.error(stderr);
				});
			}
		});
	}
}

module.exports = Babel;
