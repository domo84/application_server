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

		this.tasks = {
			babel: new Babel(env),
			sass: new Sass(env),
			static_files: new StaticFiles(env)
		};
	}

	run()
	{
		var task_count = 0;

		watch(process.cwd() + "/src", { recursive: true }, (path) =>
		{
			task_count++;

			let before = new Date();
			let filename = path.replace(process.cwd() + "/", "");
			
			var task;
			var result;

			if(filename.match(/index\.html/))
			{
				task = "static";
				result = true;
				log_begin();
				this.tasks.static_files._copyIndex();
			}
			else if(filename.match(/\.(js|html)$/))
			{
				task = "babel";
				log_begin();
				result = this.tasks.babel.run();
			}
			else if(filename.match(/images\//))
			{
				task = "static";
				result = true;
				log_begin();
				this.tasks.static_files._copyImage(filename);
			}
			else if(filename.match(/\.scss/))
			{
				task = "sass";
				log_begin();
				result = this.tasks.sass.run();
			}
			else
			{
				task = "no_handler";
				log_begin();
				return;
			}

			log_end();

			socket.emit("bump");
			socket.close();

			function log_begin()
			{
				console.log(`[${task_count}]`, `[${hms(before)}]`, "watch", task, filename);
			}

			function log_end()
			{
				let after = new Date();
				let elapsed_time = after.getTime() - before.getTime() + "ms";

				console.log(`[${task_count}]`, `[${hms(after)}]`, "watch", task, "done", result, elapsed_time);
			}

			function hms(date)
			{
				return date.toTimeString().substr(0, 8);
			}
		});
	}
}

module.exports = Watcher;