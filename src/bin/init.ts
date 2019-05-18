
import { init } from '../index';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { exit } from './utils';
import { BaseArgs } from './options';

type InitArgs = BaseArgs & {
	directory: string;
};

const builder: CommandBuilder<BaseArgs, InitArgs> = (yargs: Argv<BaseArgs>) => {
	return yargs
		.positional('directory', {
			type: 'string',
			default: '.',
			describe: 'The directory to create the migration project in'
		});
};

const handler = async (args: Arguments<InitArgs>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = resolve(process.cwd(), args.directory);

	try {
		await init(path);
		
		console.log(`Created new project "${basename(path)}"`);
		
		await exit(0);
	}

	catch (error) {
		logger.error(error);
		
		await exit(1);
	}
};

export const initCommand: CommandModule<BaseArgs, InitArgs> = {
	command: 'init [directory]',
	describe: 'Create a new migration project',
	handler: handler,
	builder: builder
};
