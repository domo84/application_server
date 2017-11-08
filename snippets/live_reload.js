// WILL BE INCLUDED IN scripts.lib.js
const address = location.origin + ":8010";
const socket = require("socket.io-client")(address, { reconnection: false });

// TODO: Not sure, probably old dev stuff
socket.on("event", function(data)
{
	console.log("event", data);
});

socket.on("connect", function()
{
	console.log("DOMO/AS", "live_reload", "connected");
	socket.emit("room", "web");
	socket.on("reload", function()
	{
		location.reload();
	});
});

socket.on("disconnect", function()
{
	console.log("DOMO/AS", "live_reload", "disconnected", "(Reconnection is disabled. Reload to reconnect)");
	socket.off("reload");
});
