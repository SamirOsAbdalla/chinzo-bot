
import {
    Client, GuildMember, EmbedBuilder, ChannelType,
    PermissionsBitField, userMention, Events
} from "discord.js"
import findTextChannel from "../utils/findTextChannel"

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {

        const channels = await member.guild.channels.fetch()

        const rulesChannel = channels.find(channel => channel?.name == "rules")
        const welcomeChannel = channels.find(channel => channel?.name == "👋welcome")
        const eventsChannel = channels.find(channel => channel?.name == "📅-events")
        let welcomeEmbed = new EmbedBuilder()
            .setColor("#FFFFFF")
            .setTitle(`Thank you for joining \`Gator Greasers\` automotive club!`)
            .setDescription(
                `Please feel free to check out some of the things you can do below.\n-------------------------------------------------------------------\n
                🚗 | \u1CBCCheck out our [IG](https://www.instagram.com/gator.greasers/) & [GatorXperience page](https://sfsu.campuslabs.com/engage/organization/gatorgreasers)\n
                📕 | \u1CBCRead the rules in <#${rulesChannel?.id}>\n
                📅 | \u1CBCCheck out our events in <#${eventsChannel?.id}>\n`
            )
            .setThumbnail("https://i.imgur.com/9wC6WrJ.png")
            .setAuthor({ name: "GreasyBot" })

        // const foundChannel = findTextChannel(member)

        if (welcomeChannel?.type == ChannelType.GuildText && !member.user.bot) {
            welcomeChannel.send({ target: member, content: `<@${member.user.id}>`, embeds: [welcomeEmbed] })
        }
    }
}
