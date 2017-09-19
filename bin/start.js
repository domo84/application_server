#!/usr/bin/env node

"use strict";

const fork = require("child_process").fork;
const Promise = require("promise");
const Environment = require("../lib/environment");
const Sass = require("../tasks/sass");
const StaticFiles = require("../tasks/static_files");
const MyBrowserify = require("../tasks/my_browserify");

var start_date = new Date();

start();

function start()
{
	log_start();

	let env = new Environment();
	env.setup();

	let sf = new StaticFiles(env);

	let sass = new Sass(env);
	let mb = new MyBrowserify(env);

	let promise = new Promise.all([
		sf.copy(),
		sass.run(),
		mb.createLibs(),
		mb.run()
	]);
	promise.done(function ok(res)
	{
		log_ready();
	}, function err(err)
	{
		console.error("ERROR", "HAPND", err);
	});

	var workers = {
		watcher: fork(__dirname + "/../workers/watcher", [], {})
		// web_server: fork(__dirname + "/../workers/web_server", [], {}),
		// reload: fork(__dirname + "/../workers/reload", [], {})
	};
}

process.on("SIGINT", function()
{
	console.log("");
	log_stop();
	process.exit();
});

function log_start()
{
	let ts = start_date.toTimeString().substr(0, 8);

	console.log("[X]", `[${ts}]`, "application_server", "starting");
}

function log_ready()
{
	let now = new Date();
	let elapsed_time = now.getTime() - start_date.getTime() + "ms";
	let ts = now.toTimeString().substr(0, 8);

	console.log("[X]", `[${ts}]`, "application_server", "ready", elapsed_time);
}

function log_stop()
{
	let now = new Date();
	let elapsed_time = now.getTime() - start_date.getTime();
	let ts = now.toTimeString().substr(0, 8);

	function msToTime(duration)
	{
		var milliseconds = parseInt((duration%1000)/100);
		var seconds = parseInt((duration/1000)%60);
		var minutes = parseInt((duration/(1000*60))%60);
		var hours = parseInt((duration/(1000*60*60))%24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;

		return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	}

	console.log("[X]", `[${ts}]`, "application_server", "closing", `[uptime ${msToTime(elapsed_time)}]`);
}
