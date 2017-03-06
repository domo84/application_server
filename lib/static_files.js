"use strict";

const fs = require("fs");
const spawn = require("child_process").spawn;
const mkdirp = require("mkdirp");

class StaticFiles
{
	constructor(env)
	{
		this.logs = {
			"stdout": env.paths.log + "/static_files_out.log",
			"stderr": env.paths.log + "/static_files_error.log"
		};
		this.env = env;
	}

	copy()
	{
		this._copyIndex();
		this._copyImages();
	}

	_copyIndex()
	{
		let source = process.cwd() + "/src/html/index.html";
		let target = this.env.paths.html + "/index.html";
		fs.readFile(source, "utf8", function(data)
		{
			fs.writeFile(target, data);
		});
	}

	_copyImages()
	{
		let source = process.cwd() + "/src/images";
		let target = this.env.paths.html;

		let args = ["-R", source, target];

		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");
		spawn("cp", args, { stdio: [ "ignore", out, err ] }); 
	}

	_copyImage(filename)
	{
		let base = this.env.paths.html;

		fs.readFile(filename, "utf8", function(data)
		{
			let file = filename.replace(/^src/, "");
			let target = base + file;
			let path = base + file.substring(0, file.lastIndexOf("/"));
			fs.stat(path, function(err, stats)
			{
				if(err)
				{
					mkdirp(path, function()
					{
						write(target, data);
					});
				}
				else
				{
					write(target, data);
				}

				function write(target, data)
				{
					fs.writeFile(target, data, function(err)
					{
						if(err)
						{
							console.error("static_files", target);
						}
					});
				}
			});
		});
	}
}

module.exports = StaticFiles;
