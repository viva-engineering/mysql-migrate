
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';

export interface ConnectionArgs {
	environment?: string;
	host?: string;
	port?: number;
	user?: string;
	password?: string;
	database?: string;
}

export const addConnectionOptions = (yargs: Argv<ConnectionArgs>): Argv<ConnectionArgs> => {
	return yargs
		.option('e', {
			alias: 'environment',
			type: 'string',
			describe: 'The environment from the config file to use',
			default: 'default'
		})
		.option('h', {
			alias: 'host',
			type: 'string',
			describe: 'The database host to connect to'
		})
		.option('p', {
			alias: 'port',
			type: 'number',
			describe: 'The port to connect to the database with'
		})
		.option('u', {
			alias: 'user',
			type: 'string',
			describe: 'The username to connect to the database with'
		})
		.option('pw', {
			alias: 'password',
			type: 'string',
			describe: 'The password to connect to the database with'
		})
		.option('d', {
			alias: 'database',
			type: 'string',
			describe: 'The database name to connect to'
		});
};
