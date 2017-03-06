"use strict";

const watch = require("node-watch");
const spawn = require("child_process").spawn;
const fork = require("child_process").fork;

const Environment = require("../lib/environment");
const Babel = require("../lib/babel");
const Sass = require("../lib/sass");
const StaticFiles = require("../lib/static_files");

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
			const socket = require("socket.io-client")("localhost:8001");

			let filename = path.replace(process.cwd() + "/", "");

			if(filename.match(/\.js$/))
			{
				console.log("watch", "babel", filename);
				that.babel.run();
			}
			else if(filename.match(/index\.html/))
			{
				console.log("watch", "static", "index.html");
				that.static_files._copyIndex();
			}
			else if(filename.match(/images\//))
			{
				console.log("watch", "static", filename);
				that.static_files._copyImage(filename);
			}
			else if(filename.match(/\.scss/))
			{
				console.log("watch", "sass", filename);
				that.sass.run();
			}

			socket.emit("bump");
			socket.close();
		});
	}
}

module.exports = Watcher;
