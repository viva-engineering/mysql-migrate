
import { Argv, CommandModule, CommandBuilder, Arguments } from 'yargs';

export interface BaseArgs {
	verbose: boolean;
}

export interface ConnectionArgs {
	environment?: string;
	host?: string;
	port?: number;
	user?: string;
	password?: string;
	database?: string;
}

export const addConnectionOptions = (yargs: Argv<BaseArgs>): Argv<ConnectionArgs> => {
	return yargs
		.option('e', {
			alias: 'environment',
			type: 'string',
			describe: 'The environment from the config file to use',,
			requiresArg: true,
			default: 'default'
		})
		.option('h', {
			alias: 'host',
			type: 'string',
			describe: 'The database host to connect to',
			requiresArg: true,
		})
		.option('p', {
			alias: 'port',
			type: 'number',
			describe: 'The port to connect to the database with',
			requiresArg: true,
		})
		.option('u', {
			alias: 'user',
			type: 'string',
			describe: 'The username to connect to the database with',
			requiresArg: true,
		})
		.option('pw', {
			alias: 'password',
			type: 'string',
			describe: 'The password to connect to the database with',
			requiresArg: true,
		})
		.option('d', {
			alias: 'database',
			type: 'string',
			describe: 'The database name to connect to',
			requiresArg: true,
		})
		.group([ 'e', 'h', 'p', 'u', 'pw', 'd' ], 'Connection Info')
		.conflicts('e', [ 'h', 'p', 'u', 'pw', 'd' ]);
};
