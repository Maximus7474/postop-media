import {
	REST,
	Routes,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import commandList from '../src/commands/index';
import env from '../src/utils/env';

/**
 * Extracts the Client ID from the Bot Token
 */
function getUserIdFromToken(token: string): string {
	const base64Str = token.split('.')[0]!;
	const decodedStr = Buffer.from(base64Str, 'base64').toString('utf-8');
	return BigInt(decodedStr).toString();
}

const TOKEN = env.DISCORD_BOT_TOKEN;
const CLIENT_ID = getUserIdFromToken(TOKEN);
const GUILD_ID = env.MAIN_GUILD_ID;

const clearCommands = process.argv.includes('--clear-commands');

const commands = {
	public: [] as RESTPostAPIChatInputApplicationCommandsJSONBody[],
	guild: [] as RESTPostAPIChatInputApplicationCommandsJSONBody[],
};

if (clearCommands) {
	console.log('🗑️  Clearing all commands...');
} else {
	if (!Array.isArray(commandList)) {
		console.error(
			'❌ Expected an array of commands from ./src/commands/index.ts',
		);
		process.exit(1);
	}

	for (const command of commandList) {
		if (command && typeof command.register === 'function') {
			const commandData = command.register().toJSON();
			console.log(`📜 Prepared command: ${commandData.name}`);

			const isGuildSpecific =
				typeof command.isGuildSpecific === 'function' &&
				command.isGuildSpecific();
			commands[isGuildSpecific ? 'guild' : 'public'].push(commandData);
		} else {
			console.warn(`⚠️  Skipping invalid command: Missing 'register' function.`);
		}
	}

	console.log(
		`📜 Found ${commands.public.length} public and ${commands.guild.length} guild commands.`,
	);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
	try {
		const total = commands.public.length + commands.guild.length;
		if (!clearCommands)
			console.log(`🔁 Started refreshing ${total} application (/) commands.`);

		// Handle Guild Commands
		if (GUILD_ID) {
			await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
				body: commands.guild,
			});
			console.log(`✅ Successfully reloaded guild-specific (/) commands.`);
		} else if (commands.guild.length > 0) {
			console.warn(
				'⚠️  Guild commands found, but MAIN_GUILD_ID is missing in .env',
			);
		}

		// Handle Global Commands
		await rest.put(Routes.applicationCommands(CLIENT_ID), {
			body: commands.public,
		});
		console.log(`✅ Successfully reloaded global (/) commands.`);

		console.log('✅ Finished command registration.\n');
	} catch (error) {
		console.error('❌ Failed to register commands:', error);
	}
})();
