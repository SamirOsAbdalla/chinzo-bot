import {
    ChatInputCommandInteraction, Client,
    GuildScheduledEvent, Events,
    ChannelType, EmbedBuilder
} from "discord.js";
import { client } from "../Bot";
const dayjs = require('dayjs')
let localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)


module.exports = {
    name: Events.GuildScheduledEventCreate,
    async execute(guildScheduledEvent: GuildScheduledEvent) {
        const guild = await client.guilds.fetch(guildScheduledEvent.guildId)
        const channels = await guild.channels.fetch()
        const eventChannel = channels.find(channel => channel?.name == "📅-events")

        if (eventChannel?.type == ChannelType.GuildText) {

            const date = dayjs(guildScheduledEvent.scheduledStartTimestamp).format('LLLL')
            let eventEmbed = new EmbedBuilder()
                .setTitle(`${guildScheduledEvent.name}`)
                .setDescription(
                    `**Attention *greasy gators*, we are excited to announce our newest event!**\n\n\n` +
                    `**Event Name**\n` +
                    `\`${guildScheduledEvent.name}\`\n\n` +
                    `**Event Description**\n` +
                    `\`${guildScheduledEvent.description}\`\n\n` +
                    `**Event Date and Time**\n` +
                    `\`${date}\`\n\n` +
                    `**Location**\n` +
                    `${guildScheduledEvent.entityMetadata?.location}`
                )
                .setColor("#FFFFFF")

            await eventChannel.send({ content: `@everyone`, embeds: [eventEmbed] })
        }
    }
}