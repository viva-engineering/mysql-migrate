
import { resolve } from 'path';
import { logger } from './logger';
import { mkdir, copyFileTemplate } from './utils';
import { TemplateFiles, ConfigFile } from './files';

export const init = async (root: string) => {
	await createProjectRoot(root);
	await createConfigFile(root);
};

const createProjectRoot = async (root: string) => {
	logger.verbose(`Ensuring that directory "${root}" exists...`);

	await mkdir(root);

	logger.verbose(`Directory "${root}" exists.`);
};

const createConfigFile = async (root: string) => {
	logger.verbose(`Creating "${ConfigFile}" config file...`);

	await copyFileTemplate(TemplateFiles.ConfigFile, root);

	logger.verbose(`Config file "${ConfigFile}" created.`);
};
