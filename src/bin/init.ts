
import { init } from '../index';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';

interface Args {
	verbose: boolean;
	directory: string;
}

const builder: CommandBuilder<Args, Args> = (yargs: Argv<Args>) => {
	return yargs
		.positional('directory', {
			type: 'string',
			default: '.',
			describe: 'The directory to create the migration project in'
		})
};

const handler = async (args: Arguments<Args>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = resolve(process.cwd(), args.directory);

	try {
		await init(path);
		logger.info(`Created new project "${basename(path)}"`);
		process.exit(0);
	}

	catch (error) {
		logger.error(error);
		process.exit(1);
	}
};

export const initCommand: CommandModule<Args, Args> = {
	command: 'init [directory]',
	describe: 'Create a new migration project',
	handler: handler,
	builder: builder
};
