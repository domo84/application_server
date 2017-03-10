"use strict";

const Environment = require("../lib/environment");

let env = new Environment();
let port = env.config.application_server.reload;

const io = require("socket.io")(port);

io.on("connection", function(socket)
{
	socket.on("bump", function()
	{
		io.emit("reload");
	});
});
