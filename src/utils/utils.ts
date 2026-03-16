export const isDev = process.env.NODE_ENV ?? 'development';

export async function isDiscordTokenValid(token: string): Promise<boolean> {
	const cleanToken = token.trim();

	if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(cleanToken)) {
		return false;
	}

	try {
		const response = await fetch('https://discord.com/api/v10/users/@me', {
			headers: {
				Authorization: `Bot ${cleanToken}`,
			},
		});

		return response.status === 200;
	} catch (error) {
		console.error('Failed to reach Discord API:', error);
		return false;
	}
}
