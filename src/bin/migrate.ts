
import { migrate } from '../index';
import { getEnvironmentConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { BaseArgs, ConnectionArgs, addConnectionOptions } from './options';
import { exit } from './utils';

type MigrateArgs = BaseArgs & ConnectionArgs & {
	target: string;
}

const builder: CommandBuilder<BaseArgs, MigrateArgs> = (yargs: Argv<BaseArgs>) => {
	return (addConnectionOptions(yargs) as Argv<MigrateArgs>)
		.option('t', {
			alias: 'target',
			type: 'string',
			describe: 'The name of the target version',
			demand: true
		})
		.group([ 't' ], 'Command Options');
};

const handler = async (args: Arguments<MigrateArgs>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		const config = await getEnvironmentConfig(path, args.environment, args);

		console.log(`Migrating to new target version ${args.target}...`);
		
		await migrate(path, config, args.target);
		
		console.log('Migration complete');
		
		await exit(0);
	}

	catch (error) {
		logger.error(error);

		await exit(1);
	}
};

export const migrateCommand: CommandModule<BaseArgs, MigrateArgs> = {
	command: 'migrate [target]',
	describe: 'Migrates the database up to the given version',
	handler: handler,
	builder: builder
};
