import { isDiscordTokenValid } from './utils';
import Logger from './logger';
import config from './config';
const logger = new Logger('ENV');

const fields = {
	DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
	MAIN_GUILD_ID: process.env.MAIN_GUILD_ID,
	API_KEY: process.env.API_KEY,
	IMAGE_API_KEY: process.env.IMAGE_API_KEY,
	VIDEO_API_KEY: process.env.VIDEO_API_KEY,
};

interface Env {
	DISCORD_BOT_TOKEN: string;
	MAIN_GUILD_ID: string | false;
	API_KEY: string | undefined;
	IMAGE_API_KEY: string | undefined;
	VIDEO_API_KEY: string | undefined;
}

if (
	!fields.DISCORD_BOT_TOKEN ||
	!(await isDiscordTokenValid(fields.DISCORD_BOT_TOKEN))
) {
	throw new Error(
		'No Discord Token was provided in the environment variables, make sure it\'s set under "DISCORD_BOT_TOKEN"',
	);
}

if (!fields.MAIN_GUILD_ID) {
	logger.warn(
		'No MAIN_GUILD detected, deployed commands will not be restricted to a guild !',
	);
}

const validateKey = (key: string | undefined, name: string) => {
	if (!key && !fields.API_KEY)
		throw new Error(
			`Missing credentials for ${name}. Set ${name}_API_KEY or global API_KEY.`,
		);
	if (!key)
		logger.warn(`No ${name}_API_KEY detected; falling back to global API_KEY.`);
};

if (config.UploadMethod !== 'custom') {
	validateKey(fields.IMAGE_API_KEY, 'IMAGE');
	validateKey(fields.VIDEO_API_KEY, 'VIDEO');
} else {
	logger.info('Skipping API_KEY validation as upload method is set to "custom"');
}

const env: Env = {
	DISCORD_BOT_TOKEN: fields.DISCORD_BOT_TOKEN,
	MAIN_GUILD_ID: fields.MAIN_GUILD_ID ?? false,
	API_KEY: fields.API_KEY,
	IMAGE_API_KEY: fields.IMAGE_API_KEY ?? fields.API_KEY,
	VIDEO_API_KEY: fields.VIDEO_API_KEY ?? fields.API_KEY,
};

export default env;
