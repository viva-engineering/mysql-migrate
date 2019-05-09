
import { loadConfig } from '../config';
import { listMigrations } from '../list';
import { PromiseCompletionFunction, Arguments } from 'yargs';

const commands = [
	'init',
	'bootstrap',
	'create',
	'list',
	'migrate',
	'rollback',
	'history',
	'completion',
	'--help',
	'--version'
];

export const completion: PromiseCompletionFunction = async (current: string, argv: Arguments) : Promise<string[]> => {
	// If no arguments have been typed, just return the whole command list
	if (! argv._.length) {
		return commands;
	}

	// If currently typing a command, try to complete that
	if (argv._.length === 1) {
		return commands.filter((command) => {
			return command.indexOf(current) === 0;
		});
	}

	const command = argv._[0];

	// If typing out a migration name, auto-complete with valid migration names
	if (command === 'migrate' || command === 'rollback') {
		const path = process.cwd();

		try {
			const config = await loadConfig(path);
			const migrations = await listMigrations(path);

			return migrations.filter((migration) => {
				return migration.indexOf(current) === 0;
			});
		}

		catch (error) {
			return [ ];
		}
	}

	return [ ];
};
