
import { Connection } from 'mysql';
import { connect, query } from './db';
import { DatabaseConfig } from './config';
import { Actions, createHistoryTable, addHistoryRecord, readRecentHistory, History } from './history';
import { logger } from './logger';

export const bootstrap = async (config: DatabaseConfig) => {
	const connection = await connect(config);

	let history: History;

	try {
		[ history ] = await readRecentHistory(connection);
	}

	catch (error) {
		// pass
	}

	if (history) {
		logger.verbose('Database already bootstrapped');
	}

	await createHistoryTable(connection);
	await addHistoryRecord(connection, Actions.Bootstrap, '-');

	logger.verbose(`Closing database connection`);
	connection.destroy();
};
