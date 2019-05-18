
import { getHistory } from '../index';
import { getEnvironmentConfig } from '../config';
import { resolve, basename } from 'path';
import { logger, setLogLevel, LogLevel } from '../logger';
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';
import { BaseArgs, ConnectionArgs, addConnectionOptions } from './options';
import { formatHistoryRecordList, exit } from './utils';
import { mysqlUrl } from '../utils';

type HistoryArgs = BaseArgs & ConnectionArgs & {
	num: number;
};

const builder: CommandBuilder<BaseArgs, HistoryArgs> = (yargs: Argv<BaseArgs>) => {
	return (addConnectionOptions(yargs) as Argv<HistoryArgs>)
		.option('n', {
			alias: 'num',
			type: 'number',
			describe: 'The number of history records to retrieve',
			default: 1
		})
		.group([ 'n' ], 'Command Options');
};

const handler = async (args: Arguments<HistoryArgs>) => {
	if (args.verbose) {
		setLogLevel(LogLevel.Verbose);
	}

	const path = process.cwd();

	try {
		const config = await getEnvironmentConfig(path, args.environment);
		const history = await getHistory(config, args.num);
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

		await exit(0);
	}

	catch (error) {
		logger.error(error);
		
		await exit(1);
	}
};

export const historyCommand: CommandModule<BaseArgs, HistoryArgs> = {
	command: 'history',
	describe: 'Returns the recent migration history of the database',
	handler: handler,
	builder: builder
};
