
import { migrate } from '../index';
import { getEnvironmentConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { BaseArgs, ConnectionArgs, addConnectionOptions } from './options';
import { exit } from './utils';

type MigrateArgs = BaseArgs & ConnectionArgs & {
	target?: string;
	full: boolean;
}

const builder: CommandBuilder<BaseArgs, MigrateArgs> = (yargs: Argv<BaseArgs>) => {
	return (addConnectionOptions(yargs) as Argv<MigrateArgs>)
		.option('t', {
			alias: 'target',
			type: 'string',
			describe: 'The name of the target version',
			conflicts: 'f'
		})
		.option('f', {
			alias: 'full',
			type: 'boolean',
			describe: 'Migrates the database all the way, running every not already run migration',
			conflicts: 't'
		})
		.group([ 't', 'f' ], 'Command Options');
};

const handler = async (args: Arguments<MigrateArgs>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		const config = await getEnvironmentConfig(path, args.environment, args);

		if (args.full) {
			console.log('Running full migration...');
		}
		else {
			console.log(`Migrating to new target version ${args.target}...`);
		}
		
		await migrate(path, config, args.target, args.full);
		
		console.log('Migration complete');
		
		await exit(0);
	}

	catch (error) {
		logger.error(error);

		await exit(1);
	}
};

export const migrateCommand: CommandModule<BaseArgs, MigrateArgs> = {
	command: 'migrate',
	describe: 'Migrates the database up to the given version',
	handler: handler,
	builder: builder
};
