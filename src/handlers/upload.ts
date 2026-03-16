import config from '../utils/config';
import Logger from '../utils/logger';
import type { Uploader } from '../types/uploader';
import type { GuildMember } from 'discord.js';
import FivemanageUploader from './upload_methods/fivemanage';

const logger = new Logger('UPLOAD');

const UPLOAD_SERVICES: Record<string, new () => Uploader> = {
    fivemanage: FivemanageUploader,
};

export class UploadHandler {
	private uploader: Uploader | null = null;
	private initializationPromise: Promise<void>;

	constructor() {
		const { UploadMethod } = config;

		this.initializationPromise = this.loadUploader(UploadMethod);
	}

	private async loadUploader(method: string) {
		try {
			const ServiceClass = UPLOAD_SERVICES[method.toLowerCase()];

			if (!ServiceClass) {
				throw new Error(`No handler was found for`);
			}

			this.uploader = new ServiceClass();
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
