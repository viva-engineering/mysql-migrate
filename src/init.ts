
import { resolve } from 'path';
import { logger } from './logger';
import { now, mkdir, readFile, writeFile } from './utils';

const initFileSource = resolve(__dirname, '../init-files');

export const init = async (root: string) => {
	await createProjectRoot(root);

	const [ bootstrapDir ] = await Promise.all([
		createBootstrap(root),
		createConfigFile(root)
	]);

	await createBootstrapUpFile(bootstrapDir);
};

const createProjectRoot = async (root: string) => {
	logger.verbose(`Ensuring that directory "${root}" exists...`);

	await mkdir(root);

	logger.verbose(`Directory "${root}" exists.`);
};

const createBootstrap = async (root: string) => {
	const bootstrapDirectory = resolve(root, `./${now}-bootstrap`);

	logger.verbose(`Creating directory "${bootstrapDirectory}" for bootstrap script...`);

	await mkdir(bootstrapDirectory);

	logger.verbose(`Bootstrap directory "${bootstrapDirectory}" created.`);

	return bootstrapDirectory;
};

const createConfigFile = async (root: string) => {
	logger.verbose(`Creating ".migrate.json" config file...`);

	const contents = await readFile(initFileSource, '.migrate.json');

	await writeFile(root, '.migrate.json', contents);

	logger.verbose(`Config file ".migrate.json" created.`);
};

const createBootstrapUpFile = async (bootstrapDir: string) => {
	logger.verbose(`Creating bootstrap DDL SQL...`);

	const contents = await readFile(initFileSource, 'bootstrap.sql');

	await writeFile(bootstrapDir, 'migrate.sql', contents);

	logger.verbose(`Bootstrap DDL SQL created.`);
};
