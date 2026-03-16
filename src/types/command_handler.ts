import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder, type SlashCommandOptionsOnlyBuilder, type SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import type { DiscordClient } from "./client";
import type Logger from "../utils/logger";

export type SlashCommandBuilders = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

export interface SlashCommandOptions {
    name: string;
    guildSpecific?: boolean;
    hideFromHelp?: boolean;
    slashcommand: SlashCommandBuilders;
    callback: (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction) => Promise<void>;
    setup?: (logger: Logger, client: DiscordClient) => Promise<void>;
    autocomplete?: (logger: Logger, client: DiscordClient, interaction: AutocompleteInteraction) => Promise<void>;
}