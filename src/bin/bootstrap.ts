
import { bootstrap } from '../index';
import { getEnvironmentConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { ConnectionArgs, addConnectionOptions } from './connection-options';
import { mysqlUrl } from '../utils';

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
		const config = await getEnvironmentConfig(path, args.environment, args);

		await bootstrap(config);

		console.log(`Bootstrapped database at ${mysqlUrl(config)}`);
		process.exit(0);
	}

	catch (error) {
		logger.error(error);
		process.exit(1);
	}
};

export const bootstrapCommand: CommandModule<Args, Args> = {
	command: 'bootstrap',
	describe: 'Bootstraps a database',
	handler: handler,
	builder: builder
};
