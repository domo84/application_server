"use strict";

const socket = require("socket.io")();

socket.listen(8001);

socket.on("connection", function(socket)
{
	socket.on("bump", function()
	{
		socket.emit("reload");
	});
});
