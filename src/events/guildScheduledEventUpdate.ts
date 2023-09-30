import {
    ChatInputCommandInteraction, Client,
    GuildScheduledEvent, Events,
    ChannelType, EmbedBuilder, TextChannel
} from "discord.js";
import { client } from "../Bot";
const dayjs = require('dayjs')
let localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

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

                    console.log(newGuildScheduledEvent)
                    const date = dayjs(newGuildScheduledEvent.scheduledStartTimestamp).format('LLLL')

                    let eventEmbed = new EmbedBuilder()
                        .setTitle(`${newGuildScheduledEvent.name}`)
                        .setDescription(
                            `**Attention *greasy gators*, we are excited to announce our newest event!**\n\n\n` +
                            `**Event Name**\n` +
                            `\`${newGuildScheduledEvent.name}\`\n\n` +
                            `**Event Description**\n` +
                            `\`${newGuildScheduledEvent.description}\`\n\n` +
                            `**Event Date and Time**\n` +
                            `\`${date}\`\n\n` +
                            `**Location**\n` +
                            `${newGuildScheduledEvent.entityMetadata?.location}`
                        )
                        .setColor("#FFFFFF")

                    message.edit({ embeds: [eventEmbed] })
                }
            })
        })


    }
}
