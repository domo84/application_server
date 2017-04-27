"use strict";

const fs = require("fs");
const spawnSync = require("child_process").spawnSync;
const parser = require("node-sass");
const Promise = require("promise");

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

		return new Promise(function(fulfill, reject)
		{
			parser.render({
				file: entry,
				includePaths: ["node_modules"]
			}, function(err, res)
			{
				if(err)
				{
					reject(err);
				}
				else
				{
					fs.writeFile(exit, res, function()
					{
						fulfill();
					});
				}
			});
		});
	}

	_run()
	{
		let entry = process.cwd() + "/src/scss/main.scss";
		let exit = this.env.paths.gen + "/styles.css";

		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");

		let cmd = "./node_modules/.bin/node-sass";
		let args = [entry, exit, "--include-path", "node_modules"];
		let opts = {
			cwd: this.env.paths.cmd,
			stdio: ["ignore", out, err]
		};

		let result = spawnSync(cmd, args, opts);

		if(result.status === 0)
		{
			return true;
		}

		return false;
	}
}

module.exports = Sass;
