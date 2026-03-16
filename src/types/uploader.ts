import type { GuildMember } from "discord.js";

export interface Uploader {
    uploadBlob(blob: Blob, fileName: string, member: GuildMember): Promise<string>;
}
