
import { listMigrations } from '../index';
import { loadConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { BaseArgs, ConnectionArgs, addConnectionOptions } from './options';
import { exit } from './utils';

type ListArgs = BaseArgs & ConnectionArgs;

const builder: CommandBuilder<BaseArgs, ListArgs> = (yargs: Argv<BaseArgs>) => {
	return (addConnectionOptions(yargs) as Argv<ListArgs>);
};

const handler = async (args: Arguments<ListArgs>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		const config = await loadConfig(path);
		const migrations = await listMigrations(path);

		console.log(migrations.join('\n'));
		
		await exit(0);
	}

	catch (error) {
		logger.error(error);
		
		await exit(1);
	}
};

export const listCommand: CommandModule<BaseArgs, ListArgs> = {
	command: 'list',
	describe: 'Lists out all existing migrations',
	handler: handler,
	builder: builder
};
