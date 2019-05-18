
import { rollback } from '../index';
import { getEnvironmentConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { BaseArgs, ConnectionArgs, addConnectionOptions } from './options';
import { exit } from './utils';

type RollbackArgs = BaseArgs & ConnectionArgs & {
	target?: string;
	full: boolean;
}

const builder: CommandBuilder<BaseArgs, RollbackArgs> = (yargs: Argv<BaseArgs>) => {
	return (addConnectionOptions(yargs) as Argv<RollbackArgs>)
		.option('t', {
			alias: 'target',
			type: 'string',
			describe: 'The name of the target version',
			conflicts: 'f'
		})
		.option('f', {
			alias: 'full',
			type: 'boolean',
			describe: 'Rolls back the database all the way to the initial state',
			conflicts: 't'
		})
		.group([ 't', 'f' ], 'Command Options');
};

const handler = async (args: Arguments<RollbackArgs>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		const config = await getEnvironmentConfig(path, args.environment, args);

		if (args.full) {
			console.log('Rolling back all migrations...');
		}
		else {
			console.log(`Rolling back to new target version ${args.target}...`);
		}
		
		await rollback(path, config, args.target, args.full);
		
		console.log('Rollback complete');
		
		await exit(0);
	}

	catch (error) {
		logger.error(error);

		await exit(1);
	}
};

export const rollbackCommand: CommandModule<BaseArgs, RollbackArgs> = {
	command: 'rollback',
	describe: 'Rolls back the database to the given version',
	handler: handler,
	builder: builder
};
