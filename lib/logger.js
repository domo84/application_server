const chalk = require("chalk");

class Logger
{
	constructor()
	{
		this.count = 0;
	}

	begin(before, task, filename)
	{
		this.count++;
		console.log(`[${this.count}]`, `[${this.hms(before)}]`, "watch", task, filename);
	}

	end(before, task)
	{
		this.count++;
		let after = new Date();
		let elapsed_time = this.get_elapsed_time(after, before);

		console.log(`[${this.count}]`, `[${this.hms(after)}]`, "watch", task, elapsed_time, chalk.green("[OK]"));
	}

	error(before, task, err)
	{
		this.count++;
		let after = new Date();
		let elapsed_time = this.get_elapsed_time(after, before);

		console.log(`[${this.count}]`, `[${this.hms(after)}]`, "watch", task, elapsed_time, chalk.red("[ERROR]"), err);
	}

	hms(date)
	{
		return date.toTimeString().substr(0, 8);
	}

	get_elapsed_time(after, before)
	{
		return after.getTime() - before.getTime() + "ms";
	}
}

module.exports = Logger;
