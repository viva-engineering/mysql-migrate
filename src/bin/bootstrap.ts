
import { bootstrap } from '../index';
import { getEnvironmentConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { BaseArgs, ConnectionArgs, addConnectionOptions } from './options';
import { mysqlUrl } from '../utils';
import { exit } from './utils';

type BootstrapArgs = BaseArgs & ConnectionArgs;

const builder: CommandBuilder<BaseArgs, BootstrapArgs> = (yargs: Argv<BaseArgs>) => {
	return (addConnectionOptions(yargs) as Argv<BootstrapArgs>);
};

const handler = async (args: Arguments<BootstrapArgs>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		const config = await getEnvironmentConfig(path, args.environment, args);

		await bootstrap(config);

		console.log(`Bootstrapped database at ${mysqlUrl(config)}`);

		await exit(0);
	}

	catch (error) {
		logger.error(error);
		
		await exit(1);
	}
};

export const bootstrapCommand: CommandModule<BaseArgs, BootstrapArgs> = {
	command: 'bootstrap',
	describe: 'Bootstraps a database',
	handler: handler,
	builder: builder
};
