#!/usr/bin/env node

"use strict";

const Promise = require("promise");
const Environment = require("../lib/environment");
const Sass = require("../tasks/sass");
const StaticFiles = require("../tasks/static_files");
const MyBrowserify = require("../tasks/my_browserify");

var start_date = new Date();

build();

function build()
{
	log_start();

	let env = new Environment();
	env.setup();
	env.type = "prod";

	let sass = new Sass(env);
	sass.run();

	let mb = new MyBrowserify(env);
	let sf = new StaticFiles(env);

	let promise = new Promise.all([
		sf.copy(),
		sass.run(),
		mb.createLibs(),
		mb.run()
	]);
	promise.done(function ok(res)
	{
		log_done();
	}, function err(err)
	{
		console.error("ERROR", err);
	});
}

function log_start()
{
	let ts = start_date.toTimeString().substr(0, 8);

	console.log("[X]", `[${ts}]`, "application_server", "building");
}

function log_done()
{
	let now = new Date();
	let elapsed_time = now.getTime() - start_date.getTime() + "ms";
	let ts = now.toTimeString().substr(0, 8);

	console.log("[X]", `[${ts}]`, "application_server", "done", elapsed_time);
}
