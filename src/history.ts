
import { connect, query } from './db';
import { format, Connection } from 'mysql';
import { DatabaseConfig } from './config';
import { logger } from './logger';

export const historyTable = 'mysql_migrate_history';

export const enum Actions {
	Bootstrap = 'bootstrap',
	Migrate = 'migrate',
	Rollback = 'rollback'
}

export const createHistoryTable = async (connection: Connection) => {
	logger.verbose(`Creating history table...`);

	await query(connection, `
		create table if not exists ${historyTable} (
			id int unsigned primary key auto_increment,
			action enum ('bootstrap', 'migrate', 'rollback') not null,
			version varchar(255) not null,
			run_time timestamp not null default now(),
			run_user varchar(255) not null
		)
		Engine=InnoDB;
	`);

	logger.verbose(`History table created.`);
};

export const addHistoryRecord = async (connection: Connection, action: Actions, version: string) => {
	logger.verbose(`Writing new history table record...`);

	const record = format('(?, ?, current_user())', [ action, version ]);

	await query(connection, `
		insert into ${historyTable}
			(action, version, run_user)
		values
			${record};
	`);

	logger.verbose(`History table record written.`);
};

export interface History {
	action: Actions;
	version: string;
	run_time: string;
	run_user: string;
}

export const getHistory = async (config: DatabaseConfig, limit: number = 1) : Promise<History[]> => {
	const connection = await connect(config);
	const history = await readRecentHistory(connection, limit);

	connection.destroy();

	return history;
};

export const readRecentHistory = async (connection: Connection, limit: number = 1) : Promise<History[]> => {
	logger.verbose(`Fetching database history...`);

	try {
		const result = await query(connection, `
			select
				action,
				version,
				run_time,
				run_user
			from ${historyTable}
			order by id desc
			limit ${limit};
		`);

		logger.verbose(`Successfully retrieved history.`);

		return result.result;
	}

	catch (error) {
		if (error && error.code === 'ER_NO_SUCH_TABLE') {
			logger.verbose('Failed to load history because database has not been bootstrapped.');

			return [ ];
		}

		throw error;
	}
};
