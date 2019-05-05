
import * as mkdirp from 'mkdirp';
import { createConnection } from 'mysql';

import { resolve } from 'path';
import {
	readFile as readFileRaw,
	writeFile as writeFileRaw
} from 'fs';

export const now = (new Date)
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
