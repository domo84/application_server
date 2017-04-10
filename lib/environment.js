"use strict";

const fs = require("fs");

class Environment
{
	constructor()
	{
		let contents = fs.readFileSync(process.cwd() + "/package.json", "utf8");
		this.config = JSON.parse(contents);

		this.type = "dev";

		this.paths = {};
		this.paths.base = process.cwd();
		this.paths.gen = process.cwd() + "/gen";
		this.paths.log = process.cwd() + "/log";

		process.mainModule.paths.forEach((path) =>
		{
			let file = path + "/.bin/browserify";
			if(fs.existsSync(file))
			{
				this.paths.modules = path;
				this.paths.cmd = path + "/..";
			}
		});
	}

	setup()
	{
		if(!fs.existsSync(this.paths.log))
		{
			fs.mkdirSync(this.paths.log);
		}

		if(!fs.existsSync(this.paths.gen))
		{
			fs.mkdirSync(this.paths.gen);
		}
	}
}

module.exports = Environment;
