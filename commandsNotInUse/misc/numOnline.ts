import {
    Client, InteractionType,
    ChatInputCommandInteraction, GuildMember,
    SlashCommandBuilder
} from "discord.js"


module.exports = {
    data: new SlashCommandBuilder()
        .setName("numonline")
        .setDescription("Replies with the number of users with the 'online' status"),
    // devOnly: ,
    // testOnly: ,
    // options:,
    async execute(interaction: ChatInputCommandInteraction) {
        const members = await interaction.guild?.members.fetch({ withPresences: true })
        let numOnline = 0;
        members?.forEach((member: GuildMember) => {
            if (member.presence?.status === "online" && !member.user.bot) {
                numOnline++;
            }
        })

        const messageString = `There ${numOnline == 1 ? "is" : "are"} currently ${numOnline == 0 ? "no" : numOnline} ${numOnline == 1 ? "user" : "users"} online.`

        await interaction.reply({ content: messageString, ephemeral: true })
    }
}
