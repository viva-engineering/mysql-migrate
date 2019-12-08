
import { logger } from './logger';
import { DatabaseConfig } from './config';
import { createConnection, format, Connection, FieldInfo } from 'mysql';
import { mysqlUrl } from './utils';

export const connect = (config: DatabaseConfig, multipleStatements: boolean = true) : Promise<Connection> => {
	logger.verbose(`Connecting to database at ${mysqlUrl(config)}...`);

	return new Promise((resolve, reject) => {
		const connection = createConnection({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			multipleStatements: multipleStatements,
			dateStrings: true,
			trace: true
		});

		connection.connect(async (error) => {
			if (error) {
				return reject(error);
			}

			logger.verbose(`Connected to database.`);

			try {
				await setDatabase(connection, config.database);
			}

			catch (error) {
				return reject(error);
			}

			resolve(connection);
		});
	});
};

const setDatabase = async (connection: Connection, database: string) : Promise<void> => {
	logger.verbose(`Selecting database ${database} (creating if not exists)...`);

	await query(connection, format('create database if not exists ??', [ database ]));
	await query(connection, format('use ??', [ database ]));

	logger.verbose('Database selected.');
};

export interface QueryResult {
	result: any;
	fields: FieldInfo[];
}

export const query = (connection: Connection, query: string): Promise<QueryResult> => {
	return new Promise((resolve, reject) => {
		connection.query(query, (error, result, fields) => {
			if (error) {
				return reject(error);
			}

			resolve({ result, fields });
		});
	});
};
