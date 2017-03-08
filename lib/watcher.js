"use strict";

const watch = require("node-watch");
const spawn = require("child_process").spawn;
const fork = require("child_process").fork;
const socket = require("socket.io-client")("localhost:8001");

const Environment = require("../lib/environment");

const Babel = require("../tasks/babel");
const Sass = require("../tasks/sass");
const StaticFiles = require("../tasks/static_files");

class Watcher
{
	constructor()
	{
		let env = new Environment();
		this.babel = new Babel(env);
		this.sass = new Sass(env);
		this.static_files = new StaticFiles(env);
	}

	run()
	{
		let that = this;

		watch(process.cwd() + "/src", { recursive: true }, function(path)
		{
			let filename = path.replace(process.cwd() + "/", "");

			if(filename.match(/index\.html/))
			{
				console.log("watch", "static", "index.html");
				that.static_files._copyIndex();
				console.log("watch", "static", "done");
			}
			else if(filename.match(/\.(js|html)$/))
			{
				console.log("watch", "babel", filename);
				let result = that.babel.run();
				console.log("watch", "babel", result);
			}
			else if(filename.match(/images\//))
			{
				console.log("watch", "static", filename);
				that.static_files._copyImage(filename);
				console.log("watch", "static", "done");
			}
			else if(filename.match(/\.scss/))
			{
				console.log("watch", "sass", filename);
				let result = that.sass.run();
				console.log("watch", "sass", result);
			}
			else
			{
				console.log("watch", "no handler", filename);
			}

			socket.emit("bump");
			socket.close();
		});
	}
}

module.exports = Watcher;
