import { Client, InteractionType, ChatInputCommandInteraction, GuildMember } from "discord.js"


module.exports = {
    name: "numonline",
    description: "Replies with the number of users with the 'online' status",
    // devOnly: ,
    // testOnly: ,
    // options:,
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
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
