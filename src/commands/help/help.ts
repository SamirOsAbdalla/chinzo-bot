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
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '/numonline', value: 'Displays the number of people with an "online" status', inline: true },
                { name: '/online', value: 'Given a user in the server, this command determines if the user is online', inline: true },
                { name: '/play', value: 'Plays any video that is on Youtube', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '/rock', value: 'Sends out a game of rock, paper, scissors. Anyone can join in or you can play against Greasy!', inline: true },
                { name: '/tracktime', value: 'Displays times for a certain track. Use "list" in the options to see all available tracks\n', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '/track', value: 'Admin only. Use this to add, delete or update a track' }
            )
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true })
    }
}