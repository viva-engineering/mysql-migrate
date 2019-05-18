
import { readdir, lstat } from 'fs';
import { resolve as resolvePath } from 'path';

export const listMigrations = (dir: string) : Promise<string[]> => {
	return new Promise((resolve, reject) => {
		readdir(dir, async(error, files) => {
			if (error) {
				return reject(error);
			}

			const promises = [ ];
			const migrations = [ ];

			files.forEach((file) => {
				if (file[0] === '.') {
					return;
				}

				const path = resolvePath(dir, file);

				promises.push(new Promise((resolve, reject) => {
					lstat(path, (error, stats) => {
						if (error) {
							return reject(error);
						}

						if (stats.isDirectory()) {
							migrations.push(file);
						}

						resolve();
					});
				}));
			});

			await Promise.all(promises);

			// Make sure the list of migrations comes back in sorted order
			migrations.sort();

			resolve(migrations);
		});
	});
};
