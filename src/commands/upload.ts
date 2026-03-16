import { GuildMember, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../classes/slash_command";
import { UploadHandler } from "../handlers/upload";

const Uploader = new UploadHandler();

export default new SlashCommand({
    name: 'upload',
    slashcommand: new SlashCommandBuilder()
        .setName('upload')
        .setDescription('Ship a media file to the CDN.')
        .addAttachmentOption(option => 
            option.setName('file')
                .setDescription('The image or video to upload')
                .setRequired(true)
        ),

    callback: async (logger, client, interaction) => {
        const { guild, member } = interaction;
        if (!guild || !member) {
            await interaction.reply('This command can only be used in a guild');
            return;
        } 

        await interaction.deferReply({ ephemeral: true });
        
        const attachment = interaction.options.getAttachment('file', true);

        try {
            const fileResponse = await fetch(attachment.url);
            const fileBlob = await fileResponse.blob();

            const uploadUrl = await Uploader.upload(fileBlob, attachment.name, member as GuildMember);

            await interaction.editReply({
                content: `✅ **Post-OP:** Shipment successful!\n🔗 **URL:** ${uploadUrl}`
            });

        } catch (error) {
            logger.error("Failed to process upload:", error);
            await interaction.editReply("💥 **Post-OP:** The delivery van crashed. (Internal Server Error)");
        }
    }
});