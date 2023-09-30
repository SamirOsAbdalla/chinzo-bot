import {
    ChatInputCommandInteraction, Client,
    GuildScheduledEvent, Events,
    ChannelType, EmbedBuilder
} from "discord.js";
import { client } from "../Bot";
const dayjs = require('dayjs')

let utc = require('dayjs/plugin/utc')
let timezone = require('dayjs/plugin/timezone')
let localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)
const tz = "America/Los_Angeles"

module.exports = {
    name: Events.GuildScheduledEventCreate,
    async execute(guildScheduledEvent: GuildScheduledEvent) {

        const guild = await client.guilds.fetch(guildScheduledEvent.guildId)
        const channels = await guild.channels.fetch()
        const eventChannel = channels.find(channel => channel?.name == "📅-events")

        if (eventChannel?.type == ChannelType.GuildText) {

            const date = dayjs(guildScheduledEvent.scheduledStartTimestamp).tz(tz).format('LLLL')

            let eventEmbed = new EmbedBuilder()
                .setTitle(`${guildScheduledEvent.name}`)
                .setDescription(
                    `**Attention *greasy gators*, we are excited to announce our newest event!**\n\n\n` +
                    `__**Event Name**__\n` +
                    `\`${guildScheduledEvent.name}\`\n\n` +
                    `__**Event Description**__\n` +
                    `\`${guildScheduledEvent.description}\`\n\n` +
                    `__**Event Date and Time**__\n` +
                    `\`${date}\`\n\n` +
                    `__**Location**__\n` +
                    `${guildScheduledEvent.entityMetadata?.location}`
                )
                .setColor("#FFFFFF")

            await eventChannel.send({ content: `@everyone`, embeds: [eventEmbed] })
        }
    }
}