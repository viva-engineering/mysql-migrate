
import { readFile } from './utils';
import { ConnectionArgs } from './bin/options';
import { ConfigFile } from './files';

export const loadConfig = async (dir: string) : Promise<Config> => {
	return JSON.parse(await readFile(dir, ConfigFile));
};

export const getEnvironmentConfig = async (dir: string, env: string, overrides?: ConnectionArgs) : Promise<DatabaseConfig> => {
	const envs = (await loadConfig(dir)).environments;

	if (! envs[env]) {
		throw new Error(`Environment ${env} does not exist in ${ConfigFile}`);
	}

	const config = envs[env];

	if (overrides) {
		['host', 'port', 'username', 'password', 'database'].forEach((key) => {
			if (overrides[key]) {
				config[key] = overrides[key];
			}
		});
	}

	return config;
};

export interface DatabaseConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}

export interface Config {
	environments: {
		[environment: string]: DatabaseConfig;
	};
}
