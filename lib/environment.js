"use strict";

const fs = require("fs");

class Environment
{
	constructor()
	{
		let contents = fs.readFileSync(process.cwd() + "/package.json", "utf8");
		this.config = JSON.parse(contents);

		this.type = "dev";
		this.isDev = (process.env.DEV || "true") == "true";

		this.paths = {};
		this.paths.base = process.cwd();
		this.paths.src = process.cwd() + "/src";
		this.paths.html = process.cwd() + "/src/html";
		this.paths.images = process.cwd() + "/src/images";
		this.paths.scss = process.cwd() + "/src/scss";
		this.paths.es = process.cwd() + "/src/es2017";
		this.paths.gen = process.cwd() + "/gen";
		this.paths.log = process.cwd() + "/log";

		this.files = {
			html: this.paths.html + "/index.html",
			scss: this.paths.scss + "/main.scss",
			es: this.paths.es + "/index.js"
		};

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
		for(const id in this.paths)
		{
			const path = this.paths[id];
			if(!fs.existsSync(path))
			{
				fs.mkdirSync(path);
			}
		}

		for(const id in this.files)
		{
			const path = this.files[id];
			if(!fs.existsSync(path))
			{
				fs.closeSync(fs.openSync(path, "a"));
			}
		}
	}
}

module.exports = Environment;
