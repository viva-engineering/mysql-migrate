
import { getHistory } from '../index';
import { getEnvironmentConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { ConnectionArgs, addConnectionOptions } from './connection-options';
import { formatHistoryRecordList } from './utils';
import { mysqlUrl } from '../utils';

type Args = ConnectionArgs & {
	verbose: boolean;
};

const builder: CommandBuilder<Args, Args> = (yargs: Argv<Args>) => {
	return (addConnectionOptions(yargs) as Argv<Args>)
		.option('n', {
			alias: 'num',
			type: 'number',
			describe: 'The number of history records to retrieve',
			default: 10
		});
};

const handler = async (args: Arguments<Args>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		const config = await getEnvironmentConfig(path, args.environment);
		const history = await getHistory(config);
		const output = formatHistoryRecordList(history);

		console.log(`Migration history [${mysqlUrl(config, false)}]:`);

		if (! output.length) {
			console.log('  No history exists because database has not been bootstrapped');
		}

		else {
			output.forEach((record) => {
				console.log(`  ${record}`);
			});
		}

		process.exit(0);
	}

	catch (error) {
		logger.error(error);
		process.exit(1);
	}
};

export const historyCommand: CommandModule<Args, Args> = {
	command: 'history',
	describe: 'Returns the recent migration history of the database',
	handler: handler,
	builder: builder
};
