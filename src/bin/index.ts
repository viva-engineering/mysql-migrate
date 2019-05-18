
import * as yargs from 'yargs';
import { initCommand } from './init';
import { bootstrapCommand } from './bootstrap';
import { createCommand } from './create';
import { listCommand } from './list';
import { migrateCommand } from './migrate';
import { rollbackCommand } from './rollback';
import { historyCommand } from './history';
import { completion } from './completion';

yargs
	.scriptName('mysql-migrate')
	.command(initCommand)
	.command(bootstrapCommand)
	.command(createCommand)
	.command(listCommand)
	.command(migrateCommand)
	.command(rollbackCommand)
	.command(historyCommand)
	.completion('completion', 'Outputs a bash completion script for mysql-migrate', completion)
	.option('v', {
		alias: 'verbose',
		default: false,
		type: 'boolean',
		describe: 'Enables verbose logging'
	})
	.demandCommand(1)
	.help()
	.wrap(Math.min(yargs.terminalWidth(), 120))
	.argv;
