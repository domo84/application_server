"use strict";

const fs = require("fs");
const brow

class Browserify
{
	constructor(env)
	{
		this.env = env;
		this.isDev = env.type == "dev";
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
            b.transform("uglifyify");
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
        }).pipe(fs.createFileStream(exit));

		return result;
	}
}

module.exports = Browserify;
