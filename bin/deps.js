#!/usr/bin/env node

"use strict";

const Environment = require("../lib/environment");
const MyBrowserify = require("../tasks/my_browserify");

let env = new Environment();
let mb = new MyBrowserify(env);
mb.creataLibs();
