"use strict";

const Environment = require("../lib/environment");
const Watcher = require("../lib/watcher");

let watcher = new Watcher(new Environment());
watcher.run();
