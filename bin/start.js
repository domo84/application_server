#!/usr/bin/env node

"use strict";

const fork = require("child_process").fork;

const Environment = require("../lib/environment");

const Sass = require("../tasks/sass");
const StaticFiles = require("../tasks/static_files");
const MyBrowserify = require("../tasks/my_browserify");

var start_date = new Date();

log_start();
start();
log_ready();

function start()
{
	let env = new Environment();
	env.setup();

	let sass = new Sass(env);
	sass.run();

	let sf = new StaticFiles(env);
	sf.copy();

	let mb = new MyBrowserify(env);
	mb.createLibs();
	mb.run();

	var workers = { 
		watcher: fork(__dirname + "/../workers/watcher", [], {}),
		// web_server: fork(__dirname + "/../workers/web_server", [], {}),
		reload: fork(__dirname + "/../workers/reload", [], {})
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
	let elapsed_time = now.getTime() - start_date.getTime() + "ms";
	let ts = now.toTimeString().substr(0, 8);

	console.log("[X]", `[${ts}]`, "application_server", "closing", elapsed_time);
}
