
import { createMigration } from '../index';
import { loadConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';

type Args = {
	name: string;
	verbose: boolean;
}

const builder: CommandBuilder<Args, Args> = (yargs: Argv<Args>) => {
	return yargs
		.positional('name', {
			type: 'string',
			describe: 'The name of the new migration'
		});
};

const handler = async (args: Arguments<Args>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		// We don't actually need the config, we just load it to ensure we're in a valid directory
		await loadConfig(path);

		const name = await createMigration(path, args.name);

		console.log(`Created new migration "${name}"`);
		process.exit(0);
	}

	catch (error) {
		logger.error(error);
		process.exit(1);
	}
};

export const createCommand: CommandModule<Args, Args> = {
	command: 'create [name]',
	describe: 'Creates a new migration',
	handler: handler,
	builder
};
