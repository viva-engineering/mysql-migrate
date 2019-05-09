
import { logger } from './logger';
import { DatabaseConfig } from './config';
import { createConnection, format, Connection, FieldInfo } from 'mysql';
import { mysqlUrl } from './utils';

export const connect = (config: DatabaseConfig) : Promise<Connection> => {
	logger.verbose(`Connecting to database at ${mysqlUrl(config)}...`);

	return new Promise((resolve, reject) => {
		const connection = createConnection({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			multipleStatements: true,
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

const setDatabase = (connection: Connection, database: string) : Promise<void> => {
	return new Promise((resolve, reject) => {
		logger.verbose(`Selecting database ${database} (creating if not exists)...`);

		const query = format('create database if not exists ??; use ??;', [ database, database ]);

		connection.query(query, (error) => {
			if (error) {
				return reject(error);
			}

			logger.verbose('Database selected.');

			resolve();
		});
	});
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
