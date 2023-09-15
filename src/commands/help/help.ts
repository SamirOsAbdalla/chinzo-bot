import {
    EmbedBuilder, InteractionType,
    ChatInputCommandInteraction, GuildMember,
    SlashCommandBuilder
} from "discord.js"


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lists all commands along with their function"),

    async execute(interaction: ChatInputCommandInteraction) {

        const helpEmbed = new EmbedBuilder()
            .setTitle("How to use GreasyBot")
            .setDescription("Useful Commands!")
            .setColor("#FFFFFF")
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '/play', value: 'Plays any video that is on Youtube', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '/tracktime', value: 'Displays times for a certain track. Use "list" in the options to see all available tracks\n', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '/track', value: 'Admin only. Use this to add, delete or update a track' },
                { name: '\u200B', value: '\u200B' },
                { name: '/poll', value: 'Admin only. Use "create" to create a new poll with up to 4 fields\n', inline: true },
            )
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true })
    }
}