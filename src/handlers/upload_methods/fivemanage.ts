import type { GuildMember } from 'discord.js';
import type { Uploader } from '../../types/uploader';
import env from '../../utils/env';
import Logger from '../../utils/logger';

const logger = new Logger('FIVEMANAGE');

const url = 'https://api.fivemanage.com/api/v3/file';

export default class FivemanageUploader implements Uploader {
    private getApiKey(mime: string): { apiKey: string, mimeType: 'image' | 'video' | 'other' } {
        let apiKey: string | undefined;
        let mimeType: 'image' | 'video' | 'other';

        if (mime.startsWith('image/')) {
            apiKey = env.IMAGE_API_KEY;
            mimeType = 'image';
        } else if (mime.startsWith('video/')) {
            apiKey = env.VIDEO_API_KEY;
            mimeType = 'video';
        } else {
            apiKey = env.API_KEY;
            mimeType = 'other';
        }

        if (!apiKey) throw new Error("No API key found for this delivery type!");

        return { apiKey, mimeType };
    }
    
    async uploadBlob(blob: Blob, fileName: string, member: GuildMember): Promise<string> {
        const { apiKey, mimeType } = this.getApiKey(blob.type);

        const formData = new FormData();
        formData.append('file', blob, fileName);
        
        formData.append("metadata", JSON.stringify({
            name: fileName,
            description: ``,
            source: 'Discord Bot'
        }));

        formData.append("path", `postop-media/${mimeType}`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': apiKey,
                },
                body: formData
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`FiveManage API Error (${response.status}): ${errorBody}`);
            }

            const data = (await response.json()) as { id: string; url: string;};

            return data.url; 
        } catch (error) {
            logger.error(`Upload failed for ${fileName}:`, error);
            throw error;
        }
    }
}