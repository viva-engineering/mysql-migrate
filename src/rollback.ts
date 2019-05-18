
import { DatabaseConfig } from './config';
import { Actions, readRecentHistory, addHistoryRecord } from './history';
import { listMigrations } from './list';
import { connect, query, QueryResult } from './db';
import { logger } from './logger';
import { Connection } from 'mysql';
import { resolve } from 'path';
import { MigrationFiles } from './files';
import { Hooks, BeforeHookResult } from './hooks';
import { readFile, getSqlFromBeforeHookResult, isPromiseLike } from './utils';

/**
 * 
 */
export const rollback = (dir: string, config: DatabaseConfig, targetMigration: string, full?: boolean) : Promise<string[]> => {
	return new Promise(async (resolve, reject) => {
		const connection = await connect(config);

		try {
			const [ history, migrations ] = await Promise.all([
				readRecentHistory(connection, 1),
				listMigrations(dir)
			]);

			if (! history.length) {
				throw new Error('Database has not been bootstrapped, cannot rollback');
			}

			const currentVersion = findVersion(migrations, history[0].version);

			let desiredVersion: number;

			if (full) {
				desiredVersion = -1;
			}

			else {
				desiredVersion = findVersion(migrations, targetMigration);

				if (desiredVersion < 0) {
					throw new Error(`Migration ${targetMigration} not found`);
				}
			}

			if (desiredVersion >= currentVersion) {
				logger.verbose('Current version already less than or equal to the target migration. No work to be done');
			}

			for (let i = currentVersion; i > desiredVersion; i--) {
				const newVersion = i === 0
					? '-'
					: migrations[i - 1];

				await runRollback(dir, connection, migrations[i], newVersion);
			}

			resolve();
		}

		catch (error) {
			reject(error);
		}

		finally {
			connection.destroy();
		}
	});
};

/**
 * Finds the index in the migration list of a given migration version
 *
 * @param migrations The ordered list of all available migrations
 * @param version The migration to look for in the list
 */
const findVersion = (migrations: string[], version: string) => {
	if (version === '-') {
		return -1;
	}

	const index = migrations.indexOf(version);

	if (index < 0) {
		throw new Error(`Migration ${version} could not be found`);
	}

	return index;
};

/**
 * Runs the specified rollback on the given database connection
 */
const runRollback = async (dir: string, connection: Connection, migration: string, newVersion: string) => {
	const migrationDir = resolve(dir, migration);
	const hooks = getHooks(migrationDir);

	// Grab the contents of the migration file
	const originalSql = await readFile(migrationDir, MigrationFiles.RollbackSQL);

	// Run the before hook
	const beforeHookResult = hooks.before({
		action: Actions.Rollback,
		version: migration,
		sql: originalSql
	});

	// Make sure we get any updates that the hook made to the SQL
	const finalSql = await getSqlFromBeforeHookResult(originalSql, beforeHookResult);

	let error: any;
	let result: QueryResult;

	try {
		// Run the migration script
		result = await query(connection, finalSql);
	}

	catch (e) {
		error = e;
	}

	if (error) {
		// Run the after hook
		const afterHookResult = hooks.after(error, {
			action: Actions.Rollback,
			version: migration,
			sql: originalSql,
			finalSql: finalSql,
			result: result
		});

		// If the after hook returned a promise, wait for it to finish running
		if (isPromiseLike(afterHookResult)) {
			await afterHookResult;
		}

		throw error;
	}

	else {
		// Update the history table
		await addHistoryRecord(connection, Actions.Rollback, newVersion);

		// Run the after hook
		const afterHookResult = hooks.after(null, {
			action: Actions.Rollback,
			version: migration,
			sql: originalSql,
			finalSql: finalSql,
			result: result
		});

		// If the after hook returned a promise, wait for it to finish running
		if (isPromiseLike(afterHookResult)) {
			await afterHookResult;
		}
	}
};

/**
 * 
 */
const getHooks = (dir: string) : Hooks => {
	logger.verbose(`Loading in hooks "${MigrationFiles.RollbackHooks}" for migration at "${dir}"`);

	try {
		const hooks: Hooks = require(resolve(dir, MigrationFiles.RollbackHooks));
		
		logger.verbose(`Loaded hooks "${MigrationFiles.RollbackHooks}" for migration at "${dir}"`);
		
		return hooks;
	}

	catch (error) {
		logger.verbose(`No hooks found at "${MigrationFiles.RollbackHooks}" for migration at "${dir}", continuing with no hooks`);

		const hooks = {
			before: () => { },
			after: () => { }
		};

		return hooks as any as Hooks;
	}
};
