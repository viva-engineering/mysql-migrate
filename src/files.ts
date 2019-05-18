
export const enum MigrationFiles {
	MigrateSQL = 'migrate.sql',
	RollbackSQL = 'rollback.sql',
	MigrateHooks = 'migrate-hooks.js',
	RollbackHooks = 'rollback-hooks.js'
}

export const enum TemplateFiles {
	ConfigFile = '.migrate.json',
	Hooks = 'hook.js',
	MigrateSQL = 'migrate.sql',
	RollbackSQL = 'rollback.sql'
}

export const ConfigFile = TemplateFiles.ConfigFile;
