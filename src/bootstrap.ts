
import { Connection } from 'mysql';
import { connect, query } from './db';
import { DatabaseConfig } from './config';
import { Actions, createHistoryTable, addHistoryRecord } from './history';
import { logger } from './logger';

export const bootstrap = async (config: DatabaseConfig) => {
	const connection = await connect(config);

	await createHistoryTable(connection);
	await addHistoryRecord(connection, Actions.Bootstrap, '-');

	logger.verbose(`Closing database connection`);
	connection.destroy();
};
