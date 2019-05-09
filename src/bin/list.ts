
import { listMigrations } from '../index';
import { loadConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { ConnectionArgs, addConnectionOptions } from './connection-options';

type Args = ConnectionArgs & {
	verbose: boolean;
}

const builder: CommandBuilder<Args, Args> = (yargs: Argv<Args>) => {
	return (addConnectionOptions(yargs) as Argv<Args>);
};

const handler = async (args: Arguments<Args>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		const config = await loadConfig(path);
		const migrations = await listMigrations(path);

		console.log(migrations.join('\n'));
		process.exit(0);
	}

	catch (error) {
		logger.error(error);
		process.exit(1);
	}
};

export const listCommand: CommandModule<Args, Args> = {
	command: 'list',
	describe: 'Lists out all existing migrations',
	handler: handler,
	builder: builder
};
