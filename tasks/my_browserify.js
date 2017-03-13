"use strict";

const fs = require("fs");
const Environment = require("../lib/environment");
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

		b.bundle().pipe(stream);
	}
}

module.exports = MyBrowserfy;
