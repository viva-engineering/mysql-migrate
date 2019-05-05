
import { readFile } from './utils';

export let config: Config;

export const loadConfig = async (dir: string) : Promise<void> => {
	if (! config) {
		config = JSON.parse(await readFile(dir, '.migrate.json'));
	}
};

export interface Config {
	connection: {
		host: string;
		port: number;
		username: string;
		password: string;
		database: string;
	};
}
