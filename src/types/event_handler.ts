import type { ClientEvents } from 'discord.js';
import type { DiscordClient } from './client';
import Logger from '../utils/logger';

export type EventHandlerSetup = (logger: Logger, client: DiscordClient) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHandlerCallback = (
	logger: Logger,
	client: DiscordClient,
	...args: any[]
) => void;

export interface EventHandlerOptions {
	name: string;
	eventName: keyof ClientEvents;
	type: 'on' | 'once';
	callback: EventHandlerCallback;
	setup?: EventHandlerSetup;
}
