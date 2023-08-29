
import { Client, GuildMember, EmbedBuilder, ChannelType, PermissionsBitField } from "discord.js"
import findTextChannel from "../../utils/findTextChannel"
module.exports = async (client: Client, member: GuildMember) => {
    let welcomeEmbed = new EmbedBuilder()
        .setColor("#f59342")
        .setTitle(`Welcome to ${member.guild}, ${member.user.username}!`)
        .setAuthor({ name: "Chinzo" })

    const foundChannel = findTextChannel(member)

    if (foundChannel?.type == ChannelType.GuildText) {
        foundChannel.send({ target: member, embeds: [welcomeEmbed] })
    }
}
