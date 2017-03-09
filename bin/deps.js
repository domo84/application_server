#!/usr/bin/env node

"use strict";

const fs = require("fs");
const Environment = require("../lib/environment");
const browserify = require("browserify");

let env = new Environment();
let b = browserify();

for(var dep in env.config.dependencies)
{
	b.require(dep);
}

const stream = fs.createWriteStream(env.paths.gen + "/scripts.lib.js", { flags: "a" });
b.bundle().pipe(stream);
