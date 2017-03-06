"use strict";

const Environment = require("../lib/environment");
const WebServer = require("../lib/web_server");

let ws = new WebServer(new Environment());
ws.start();
