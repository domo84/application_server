"use strict";

const fs = require("fs");
const spawnSync = require("child_process").spawnSync;
const mkdirp = require("mkdirp");
const Promise = require("promise");

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
		return new Promise.all([this.copyIndex(), this.copyImages()]);
	}

	copyIndex()
	{
		let source = process.cwd() + "/src/html/index.html";
		let target = this.env.paths.gen + "/index.html";

		return new Promise(function(fulfill, reject)
		{
			fs.readFile(source, "utf8", (err, data) =>
			{
				if(err) {
					reject(err);
				} else {
					fs.writeFile(target, data, function()
					{
						// callback-less asyncs are not allowed ..
						// so what do we put here. Hmm
						// comments?
						// -- guten dojten allehoijten --
						// och så fann vi en anledning ->
						fulfill();
					});
				}
			});
		});
	}

	copyImages()
	{
		let source = process.cwd() + "/src/images";
		let target = this.env.paths.gen;

		let args = ["-R", source, target];

		const out = fs.openSync(this.logs.stdout, "a");
		const err = fs.openSync(this.logs.stderr, "a");

		return new Promise(function(fulfill, reject)
		{
			let result = spawnSync("cp", args, {
				stdio: [ "ignore", out, err ]
			}); 
			result.status === 0 ? fullfil() : reject();
		});
	}

	copyImage(filename)
	{
		let base = this.env.paths.gen;

		return new Promise(function(fulfill, reject)
		{
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
								reject(err);
							}
							else
							{
								fulfill();
							}
						});
					}
				});
			});
		});
	}
}

module.exports = StaticFiles;
