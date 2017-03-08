"use strict";

const Environment = require("../lib/environment");
const socket = require("socket.io")();

let env = new Environment();

socket.listen(env.config.application_server.reload);

socket.on("connection", function(socket)
{
	socket.on("bump", function()
	{
		socket.emit("reload");
	});
});
