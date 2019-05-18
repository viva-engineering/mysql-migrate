
import { resolve } from 'path';
import { logger } from './logger';
import { now, mkdir, copyFileTemplate } from './utils';
import { MigrationFiles, TemplateFiles } from './files';

export const createMigration = async (dir: string, name: string) => {
	const time = now();
	const timedName = `${time}-${name}`;
	const migrationDir = resolve(dir, `./${timedName}`);

	await createMigrationDirectory(migrationDir);
	await Promise.all([
		createMigrationFile(migrationDir, TemplateFiles.MigrateSQL, MigrationFiles.MigrateSQL),
		createMigrationFile(migrationDir, TemplateFiles.RollbackSQL, MigrationFiles.RollbackSQL),
		createMigrationFile(migrationDir, TemplateFiles.Hooks, MigrationFiles.MigrateHooks),
		createMigrationFile(migrationDir, TemplateFiles.Hooks, MigrationFiles.RollbackHooks)
	]);

	return timedName;
};

const createMigrationDirectory = async (dir: string) => {
	logger.verbose(`Creating directory "${dir}"...`);

	await mkdir(dir);

	logger.verbose(`Created directory "${dir}".`);
};

const createMigrationFile = async (dir: string, src: string, dest: string) => {
	logger.verbose(`Copying file "${src}" to" "${dest}" file...`);

	await copyFileTemplate(src, dir, dest);

	logger.verbose(`File "${dest}" created.`);
};
