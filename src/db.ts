
import { createConnection } from 'mysql';
import { config, loadConfig } from './config';

export const connect = (dir: string) => {
	return new Promise(async (resolve, reject) => {
		await loadConfig(dir);

		const connection = createConnection({
			host: config.connection.host,
			port: config.connection.port,
			user: config.connection.username,
			password: config.connection.password,
			database: config.connection.database,
			multipleStatements: true
		});

		connection.connect((error) => {
			if (error) {
				return reject(error);
			}

			resolve(connection);
		});
	});
};
