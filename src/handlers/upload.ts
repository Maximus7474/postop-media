import config from '../utils/config';
import Logger from '../utils/logger';
import type { Uploader } from '../types/uploader';
import type { GuildMember } from 'discord.js';

const logger = new Logger('UPLOAD');

export class UploadHandler {
	private uploader: Uploader | null = null;
	private initializationPromise: Promise<void>;

	constructor() {
		const { UploadMethod } = config;

		this.initializationPromise = this.loadUploader(UploadMethod);
	}

	private async loadUploader(method: string) {
		try {
			const module = await import(`./upload_methods/${method}`);

			this.uploader = new module.default();
			logger.info(`Service [${method}] is ready for media uploads.`);
		} catch (err) {
			logger.error(`Failed to load service [${method}]:`, err);
			throw err;
		}
	}

	async upload(
		blob: Blob,
		fileName: string,
		member: GuildMember,
	): Promise<string> {
		await this.initializationPromise;

		if (!this.uploader) {
			throw new Error('No uploader initialized. Post-OP Media is offline.');
		}

		return await this.uploader.uploadBlob(blob, fileName, member);
	}
}
