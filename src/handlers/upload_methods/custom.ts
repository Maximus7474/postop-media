import type { GuildMember } from 'discord.js';
import type { Uploader } from '../../types';
import type { CustomUploadConfig } from '../../utils/config';
import config from '../../utils/config';

export default class CustomUploader implements Uploader {
	// CustomUpload is defined when this class is called by the upload handler
	private readonly config: CustomUploadConfig = config.CustomUpload!;

	private resolvePath(obj: any, path: string): string | undefined {
		return path.split('.').reduce((prev, curr) => {
			return prev ? prev[curr] : undefined;
		}, obj);
	}

	async uploadBlob(
		blob: Blob,
		fileName: string,
		member: GuildMember,
	): Promise<string> {
		const formData = new FormData();
		formData.append('file', blob, fileName);

		formData.append(
			'metadata',
			JSON.stringify({
				name: fileName,
				uploadedBy: `${member.displayName} (${member.user.username} - ${member.user.id})`,
				source: 'Post-OP Media - Discord Bot',
			}),
		);

		const response = await fetch(this.config.endpoint, {
			method: this.config.method,
			headers: {
				...this.config.headers,
				'X-Member-ID': member.id,
				'X-Upload-Source': 'Post-OP Media - Discord Bot',
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Upload failed: ${response.status}`);
		}

		const jsonResponse = await response.json();

		const fileUrl = this.resolvePath(jsonResponse, this.config.path);

		if (!fileUrl || typeof fileUrl !== 'string') {
			throw new Error(`Could not find file URL at path: ${this.config.path}`);
		}

		return fileUrl;
	}
}
