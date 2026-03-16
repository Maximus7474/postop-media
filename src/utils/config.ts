import { z } from 'zod';
import RawConfig from '../../config.json' with { type: 'json' };
import Logger from './logger';
const logger = new Logger('CONFIG');

const CustomUploadSchema = z.object({
	method: z.enum(['POST', 'PUT', 'PATCH']),
	endpoint: z
		.string()
		.url({ message: 'Post-OP requires a valid URL for custom drop-offs.' }),
	headers: z.record(z.string(), z.string()).optional(),
});

const ConfigSchema = z
	.object({
		UploadMethod: z.enum(['fivemanage', 'custom']),
		CustomUpload: CustomUploadSchema.optional(),
	})
	.superRefine((data, ctx) => {
		if (data.UploadMethod === 'custom' && !data.CustomUpload) {
			ctx.addIssue({
				code: 'custom',
				message:
					"When UploadMethod is 'custom', the 'CustomUpload' settings are mandatory.",
				path: ['CustomUpload'],
			});
		}
	});

export type AppConfig = z.infer<typeof ConfigSchema>;

export function getValidatedConfig(): AppConfig {
	const parse = ConfigSchema.safeParse(RawConfig);

	if (!parse.success) {
		logger.error('❌ Invalid Configuration in config.json:');

		parse.error.issues.forEach((issue) => {
			logger.error(`   - [${issue.path.join('.')}] ${issue.message}`);
		});

		process.exit(1);
	}

	return parse.data;
}

const config = getValidatedConfig();
export default config;
