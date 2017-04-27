"use strict";

const fs = require("fs");
const browserify = require("browserify");

class MyBrowserfy
{
	constructor(env)
	{
		this.env = env;
		this.isDev = env.type === "dev";

		let opts = {
			debug: false,
			bundleExternal: true
		};

		if(this.isDev)
		{
			opts.debug = true;
			opts.bundleExternal = false;
		}

		this.opts = opts;
	}

	getBrowserify()
	{
		let entry = process.cwd() + "/" + this.env.config.main;

		let b = browserify(this.opts);

		b.add(entry);

		if(!this.isDev)
		{
			b.transform({ global: true }, "uglifyify");
		}

		b.transform("node-underscorify");
		b.transform("jstify");
		b.transform("envify");
		b.transform("babelify", { presets: ["env"] });

		return b;
	}


	run()
	{
		let exit = this.env.paths.gen + "/scripts.js";
		let b = this.getBrowserify();

		return new Promise(function(fulfill, reject)
		{
			const stream = fs.createWriteStream(exit);

			stream.on("finish", function()
			{
				fulfill();
			});

			b.bundle().on("error", function(err)
			{
				reject(err);
				this.emit("end");
			}).pipe(stream);
		});
	}

	createLibs()
	{
		let out = this.env.paths.gen + "/scripts.lib.js";
		let b = browserify();

		for(var dep in this.env.config.dependencies)
		{
			b.require(dep);
		}

		if(!this.isDev)
		{
			b.transform({ global: true }, "uglifyify");
		}

		return new Promise(function(fulfill, reject)
		{
			const stream = fs.createWriteStream(out);

			stream.on("finish", fulfill);

			b.bundle().on("error", function(err)
			{
				reject(err);
				this.emit("end");
			}).pipe(stream);
		});
	}
}


module.exports = MyBrowserfy;
