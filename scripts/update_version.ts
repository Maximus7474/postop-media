import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const newVersion = Bun.argv[2];

if (!newVersion) {
	console.error('no version provided!');
	process.exit(1);
}

const packagePath = join(import.meta.dir, '../package.json');

try {
	const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));

	pkg.version = newVersion.replace(/^v/, '');

	const content = JSON.stringify(pkg, null, '\t');

	await Bun.write(packagePath, content);

	console.log(`package.json updated to ${pkg.version}`);
} catch (error) {
	console.error('failed to update version:', error);
	process.exit(1);
}
