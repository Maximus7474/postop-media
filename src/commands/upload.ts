import {
	Colors,
	EmbedBuilder,
	GuildMember,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import SlashCommand from '../classes/slash_command';
import { UploadHandler } from '../handlers/upload';

const Uploader = new UploadHandler();

export default new SlashCommand({
	name: 'upload',
	slashcommand: new SlashCommandBuilder()
		.setName('upload')
		.setDescription('Ship a media file to the CDN.')
		.addAttachmentOption((option) =>
			option
				.setName('file')
				.setDescription('The image or video to upload')
				.setRequired(true),
		),

	callback: async (logger, client, interaction) => {
		const { guild, member } = interaction;
		if (!guild || !member) {
			await interaction.reply('This command can only be used in a guild');
			return;
		}

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const attachment = interaction.options.getAttachment('file', true);

		try {
			const fileResponse = await fetch(attachment.url);
			const fileBlob = await fileResponse.blob();

			const uploadUrl = await Uploader.upload(
				fileBlob,
				attachment.name,
				member as GuildMember,
			);

			const embed = new EmbedBuilder()
				.setTitle('✅ Post-OP media')
				.setDescription('Shipment successful !')
				.setFields({
					name: '🔗 **URL:**',
					value: `\`\`\`${uploadUrl}\`\`\``,
				})
				.setColor(Colors.DarkGold)
				.setImage(uploadUrl);

			await interaction.editReply({
				content: null,
				embeds: [embed],
			});
		} catch (error) {
			logger.error('Failed to process upload:', error);
			const embed = new EmbedBuilder()
				.setTitle('💥 Post-OP media')
				.setDescription(
					'The delivery van crashed, please contact administrators.\n-# *(Internal Server Error)*',
				)
				.setColor(Colors.DarkRed);

			await interaction.editReply({
				embeds: [embed],
			});
		}
	},
});
