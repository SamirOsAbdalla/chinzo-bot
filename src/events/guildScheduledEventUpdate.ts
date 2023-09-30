import {
    ChatInputCommandInteraction, Client,
    GuildScheduledEvent, Events,
    ChannelType, EmbedBuilder, TextChannel
} from "discord.js";
import { client } from "../Bot";
const dayjs = require('dayjs')

let utc = require('dayjs/plugin/utc')
let timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
const tz = "America/Los_Angeles"

module.exports = {
    name: Events.GuildScheduledEventUpdate,
    async execute(guildScheduledEvent: GuildScheduledEvent, newGuildScheduledEvent: GuildScheduledEvent) {


        const guild = await client.guilds.fetch(newGuildScheduledEvent.guildId)
        const channels = await guild.channels.fetch()
        const eventChannel = channels.find(channel => channel?.name == "📅-events")
        const textEventChannel = eventChannel as TextChannel


        await textEventChannel.messages.fetch({ limit: 100 }).then(messages => {
            messages.forEach(message => {
                if (message?.embeds[0]?.data.title == guildScheduledEvent.name) {

                    const date = dayjs(newGuildScheduledEvent.scheduledStartTimestamp).tz(tz).format('LLLL')

                    let eventEmbed = new EmbedBuilder()
                        .setTitle(`${newGuildScheduledEvent.name}`)
                        .setDescription(
                            `**Attention *greasy gators*, we are excited to announce our newest event!**\n\n\n` +
                            `__**Event Name**__\n` +
                            `\`${newGuildScheduledEvent.name}\`\n\n` +
                            `__**Event Description**__\n` +
                            `\`${newGuildScheduledEvent.description}\`\n\n` +
                            `__**Event Date and Time**__\n` +
                            `\`${date}\`\n\n` +
                            `__**Location**__\n` +
                            `${newGuildScheduledEvent.entityMetadata?.location}`
                        )
                        .setColor("#FFFFFF")

                    message.edit({ embeds: [eventEmbed] })
                }
            })
        })


    }
}
