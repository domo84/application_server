#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
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

	if(env.live_reload == false)
	{
		log_info("livereload not configured. See README.md");
	}

	let sf = new StaticFiles(env);

	let sass = new Sass(env);
	let mb = new MyBrowserify(env);

	let promise = new Promise.all([
		sf.copy(),
		sass.run(),
		mb.createLibs(),
		mb.run()
	]);
	promise.done(function ok()
	{
		log_ready();
	}, function err(err)
	{
		log_error("startup_error", err);
	});

	// Starts the forever running watcher
	fork(__dirname + "/../workers/watcher", [], {});
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

function log_info(label, message)
{
	let now = new Date();
	let ts = now.toTimeString().substr(0, 8);

	console.log("[X]", `[${ts}]`, "application_server", label, message, chalk.yellow("[INFO]"));
}

function log_error(label, message)
{
	let now = new Date();
	let ts = now.toTimeString().substr(0, 8);

	console.error("[X]", `[${ts}]`, "application_server", label, message, chalk.red("[ERROR]"));
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
