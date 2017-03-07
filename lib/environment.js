"use strict";

const fs = require("fs");

class Environment
{
	constructor()
	{
		let contents = fs.readFileSync(process.cwd() + "/package.json", "utf8");
		this.config = JSON.parse(contents);

		this.paths = {};
		this.paths.base = process.cwd();
		this.paths.html = process.cwd() + "/html";
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

		if(!fs.existsSync(this.paths.html))
		{
			fs.mkdirSync(this.paths.html);
		}
	}
}

module.exports = Environment;
