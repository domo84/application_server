"use strict";

const fs = require("fs");
const browserify = require("browserify");

class MyBrowserfy
{
	constructor(env)
	{
		this.env = env;
	}

	createLibs()
	{
		let out = this.env.paths.gen + "/scripts.lib.js";
		let b = browserify();

		const stream = fs.createWriteStream(out);

		for(var dep in this.env.config.dependencies)
		{
			b.require(dep);
		}

		if(this.env.type === "prod")
		{
			b.transform({
				global: true
			}, "uglifyify");
		}

		b.bundle().pipe(stream);
	}
}

module.exports = MyBrowserfy;
