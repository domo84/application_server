"use strict";

const watch = require("node-watch");

const Environment = require("../lib/environment");
const Reloader = require("../lib/reloader");
const Logger = require("../lib/logger");

const MyBrowserify = require("../tasks/my_browserify");
const Sass = require("../tasks/sass");
const StaticFiles = require("../tasks/static_files");

class Watcher
{
	constructor()
	{
		let env = new Environment();

		this.tasks = {
			browserify: new MyBrowserify(env),
			sass: new Sass(env),
			static_files: new StaticFiles(env),
		};

		this.reloader = false;
		if(env.live_reload)
		{
			this.reloader = new Reloader(env);
		}
	}

	run()
	{
		var logger = new Logger();

		watch(process.cwd() + "/src", { recursive: true }, (event, path) =>
		{
			const reloader = this.reloader;

			let start = new Date();
			let filename = path.replace(process.cwd() + "/", "");
			let [task, promise] = this.parse(filename);

			logger.begin(start, task, filename);

			if(promise == false)
			{
				// If promise is false no handler has been found for the file.
				// Task should return "no_task" for sensible log output.
				return;
			}

			promise.then(function done()
			{
				logger.end(start, task);
				if(reloader)
				{
					reloader.reload();
				}
			}, function error(err)
			{
				logger.error(start, task, err);
			});
		});
	}

	parse(filename)
	{
		let task, promise;

		if(filename.match(/index\.html/))
		{
			task = "static";
			promise = this.tasks.static_files.copyIndex();
		}
		else if(filename.match(/\.(js|html|jst)$/))
		{
			task = "browserify";
			promise = this.tasks.browserify.run();
		}
		else if(filename.match(/images\//))
		{
			task = "static";
			promise = this.tasks.static_files.copyImage(filename);
		}
		else if(filename.match(/\.scss/))
		{
			task = "sass";
			promise = this.tasks.sass.run();
		}
		else
		{
			task = "no_handler";
			promise = false;
			return;
		}

		return [task, promise];
	}
}

module.exports = Watcher;
