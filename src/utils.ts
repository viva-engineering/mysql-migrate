
import * as mkdirp from 'mkdirp';
import { createConnection } from 'mysql';
import { DatabaseConfig } from './config';
import { BeforeHookResult } from './hooks';

import { resolve } from 'path';
import {
	readFile as readFileRaw,
	writeFile as writeFileRaw
} from 'fs';

const fileTemplates = resolve(__dirname, '../file-templates');

export const now = () => (new Date)
	.toISOString()
	.split('.')[0]
	.replace(/[^\d]/g, '');

export const mkdir = (path: string) : Promise<string> => {
	return new Promise((resolve, reject) => {
		mkdirp(path, (error, made) => {
			if (error) {
				return reject(error);
			}

			resolve(made);
		});
	});
};

export const readFile = (dir: string, filename: string) : Promise<string> => {
	const path = resolve(dir, filename);

	return new Promise((resolve, reject) => {
		readFileRaw(path, 'utf8', (error, contents) => {
			if (error) {
				return reject(error);
			}

			resolve(contents);
		});
	});
};

export const writeFile = (dir: string, filename: string, contents: string | Buffer) : Promise<void> => {
	const path = resolve(dir, filename);

	return new Promise((resolve, reject) => {
		writeFileRaw(path, contents, 'utf8', (error) => {
			if (error) {
				return reject(error);
			}

			resolve();
		});
	});
};

export const copyFileTemplate = async (file: string, destDirectory: string, destFile: string = file) => {
	const contents = await readFile(fileTemplates, file);

	await writeFile(destDirectory, destFile, contents);
};

export const mysqlUrl = (config: DatabaseConfig, includeUser: boolean = true) : string => {
	const user = includeUser ? `${config.user}@` : '';

	return `mysql://${user}${config.host}:${config.port}/${config.database}`;
};

/**
 * 
 */
export const getSqlFromBeforeHookResult = async (originalSql: string, result: BeforeHookResult) : Promise<string | string[]> => {
	if (typeof result === 'string' || Array.isArray(result)) {
		return result;
	}

	if (isPromiseLike(result)) {
		const promiseResult = await result;

		return promiseResult || originalSql;
	}

	return originalSql;
};

/**
 * 
 */
export const isPromiseLike = (value: any) : value is PromiseLike<any> => {
	return value != null && typeof value.then === 'function';
};
