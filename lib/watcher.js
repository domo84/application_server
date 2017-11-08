"use strict";

const watch = require("node-watch");
const chalk = require("chalk");

const Environment = require("../lib/environment");

const MyBrowserify = require("../tasks/my_browserify");
const Sass = require("../tasks/sass");
const StaticFiles = require("../tasks/static_files");
const Reloader = require("../tasks/reload");

class Watcher
{
	constructor()
	{
		let env = new Environment();

		this.tasks = {
			browserify: new MyBrowserify(env),
			sass: new Sass(env),
			static_files: new StaticFiles(env),
			reloader: new Reloader(),
		};
	}

	run()
	{
		var task_count = 0;

		watch(process.cwd() + "/src", { recursive: true }, (event, path) =>
		{
			task_count++;

			let before = new Date();
			let filename = path.replace(process.cwd() + "/", "");
			
			var task;
			var promise;

			if(filename.match(/index\.html/))
			{
				task = "static";
				log_begin();
				promise = this.tasks.static_files.copyIndex();
			}
			else if(filename.match(/\.(js|html|jst)$/))
			{
				task = "browserify";
				log_begin();
				promise = this.tasks.browserify.run();
			}
			else if(filename.match(/images\//))
			{
				task = "static";
				log_begin();
				promise = this.tasks.static_files.copyImage(filename);
			}
			else if(filename.match(/\.scss/))
			{
				task = "sass";
				log_begin();
				promise = this.tasks.sass.run();
			}
			else
			{
				task = "no_handler";
				log_begin();
				return;
			}

			const reloader = this.tasks.reloader;

			promise.then(function done()
			{
				log_end();
				reloader.reload();
			}, function error()
			{
				log_error();
			});

			function log_begin()
			{
				console.log(`[${task_count}]`, `[${hms(before)}]`, "watch", task, filename);
			}

			function log_end()
			{
				let after = new Date();
				let elapsed_time = get_elapsed_time(after);

				console.log(`[${task_count}]`, `[${hms(after)}]`, "watch", task, elapsed_time, chalk.green("[OK]"));
			}

			function log_error()
			{
				let after = new Date();
				let elapsed_time = get_elapsed_time(after);

				console.log(`[${task_count}]`, `[${hms(after)}]`, "watch", task, elapsed_time, chalk.red("[ERROR]"));
			}

			function hms(date)
			{
				return date.toTimeString().substr(0, 8);
			}

			function get_elapsed_time(date)
			{
				return date.getTime() - before.getTime() + "ms";
			}
		});
	}
}

module.exports = Watcher;
