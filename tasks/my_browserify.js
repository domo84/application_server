"use strict";

const fs = require("fs");
const browserify = require("browserify");

class MyBrowserfy
{
	constructor(env)
	{
		this.env = env;
		this.isDev = env.type === "dev";
	}

	run()
	{
		let entry = process.cwd() + "/" + this.env.config.main;
		let exit = this.env.paths.gen + "/scripts.js";

		var opts = { 
            debug: false,
            bundleExternal: true
        };  

        if(this.isDev)
        {   
            opts.debug = true;
            opts.bundleExternal = false;
        }   

        let b = browserify(opts);

        b.add(entry);

        if(!this.isDev)
        {
            b.transform({ global: true }, "uglifyify");
        }

        b.transform("node-underscorify");
        b.transform("jstify");
        b.transform("envify");
        b.transform("babelify", { presets: ["env"] });

		var result = true;
        b.bundle().on("error", function(err) {
            console.error(err.toString());
            console.error(err.codeFrame);

			result = false;

            this.emit("end");
        }).pipe(fs.createWriteStream(exit));

		return result;
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

		if(!this.isDev)
		{
			b.transform({
				global: true
			}, "uglifyify");
		}

		b.bundle().pipe(stream);
	}
}

module.exports = MyBrowserfy;
