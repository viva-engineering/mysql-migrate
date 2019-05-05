
import * as yargs from 'yargs';
import { initCommand } from './init';

yargs
	.scriptName('mysql-migrate')
	.command(initCommand)
	.option('v', {
		alias: 'verbose',
		default: false,
		type: 'boolean'
	})
	.help()
	.argv;
