"use strict";

const fs = require("fs");

class Environment
{
	constructor()
	{
		let contents = fs.readFileSync(process.cwd() + "/package.json", "utf8");
		this.config = JSON.parse(contents);

		/*
		let dir = "/home/magnus/opt/domo_as";

		this.project_base = dir + "/projects";
		this.paths = {};
		this.paths.base = this.project_base + "/" + this.config.name;
		this.paths.log = this.paths.base + "/log";
		this.paths.html = this.paths.base + "/html";
		*/

		this.paths = {};
		this.paths.base = process.cwd();
		this.paths.html = process.cwd() + "/html";
		this.paths.log = process.cwd() + "/log";
	}

	get pids()
	{
		try
		{
			let file = this.paths.base + "/pids.json";
			let contents = fs.readFileSync(file, "utf8");
			return JSON.parse(contents);
		}
		catch(e)
		{
			console.error("Environment:", "No pid file found");
			return false;
		}
	}

	save(pids)
	{
		let file = this.paths.base + "/pids.json";
		let contents = JSON.stringify(pids);
		fs.writeFile(file, contents);
	}

	setup()
	{
		/*
		if(!fs.existsSync(this.project_base))
		{
			fs.mkdirSync(this.project_base);
		}

		if(!fs.existsSync(this.paths.base))
		{
			fs.mkdirSync(this.paths.base);
		}
		*/

		if(!fs.existsSync(this.paths.log))
		{
			fs.mkdirSync(this.paths.log);
		}

		if(!fs.existsSync(this.paths.html))
		{
			fs.mkdirSync(this.paths.html);
		}
	}

	clean()
	{
		let file = this.paths.base + "/pids.json";

		if(fs.existsSync(file))
		{
			fs.unlink(file);
		}
	}
}

module.exports = Environment;
