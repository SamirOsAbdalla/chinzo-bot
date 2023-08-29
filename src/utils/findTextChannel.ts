import { GuildMember, ChannelType, PermissionsBitField } from "discord.js"

const findTextChannel = (member: GuildMember) => {
    return (member.guild.channels.cache.find(channel =>
        (channel.type == ChannelType.GuildText && channel.permissionOverwrites.cache.size == 0)
        ||
        (channel.type == ChannelType.GuildText && channel.permissionOverwrites.cache.find(permission => (!permission.deny.has("SendMessages"))))))
}

export default findTextChannel
