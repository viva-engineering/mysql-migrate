
import { createMigration } from '../index';
import { loadConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { exit } from './utils';
import { BaseArgs } from './options';

type CreateArgs = BaseArgs & {
	name: string;
}

const builder: CommandBuilder<BaseArgs, CreateArgs> = (yargs: Argv<BaseArgs>) => {
	return yargs
		.positional('name', {
			type: 'string',
			describe: 'The name of the new migration'
		});
};

const handler = async (args: Arguments<CreateArgs>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		// We don't actually need the config, we just load it to ensure we're in a valid directory
		await loadConfig(path);

		const name = await createMigration(path, args.name);

		console.log(`Created new migration "${name}"`);
		
		await exit(0);
	}

	catch (error) {
		logger.error(error);

		await exit(1);
	}
};

export const createCommand: CommandModule<BaseArgs, CreateArgs> = {
	command: 'create <name>',
	describe: 'Creates a new migration',
	handler: handler,
	builder
};
