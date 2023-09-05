import {
    Client, ChatInputCommandInteraction,
    ApplicationCommandOptionType, ModalBuilder,
    TextInputBuilder, TextInputStyle,
    ActionRowBuilder, PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import EventModel from "../models/Event";
import { EventType } from "../models/Event";


const handleListCommand = async (interaction: ChatInputCommandInteraction) => {
    const listType = interaction.options.getString("type")
    let responseString = `Here is a list of all of our upcoming events:\n\n`
    const response = await EventModel.find()
    try {
        if (listType == "all") {

            if (response.length > 0) {
                response.forEach((event: EventType, index) => {
                    const dateAndTime = event.dateAndTime
                    const [date, time] = dateAndTime.split("at")

                    let eventString: string =
                        `**${index + 1}:**  \`${event.name}\` on **${date}**${time ? `at**${time}**` : ""}\n\n` +
                        `      Location:  \`${event.location}\`\n\n` +
                        `${event.googleMapsURL}\n\n\n`

                    responseString += eventString;
                })
                await interaction.reply({ content: responseString, ephemeral: true })
            } else {
                await interaction.reply({ content: "There are no upcoming events!", ephemeral: true })
            }

        } else {
            if (response.length > 0) {

                let nextEvent = response[0]
                let nextEventDate = new Date(nextEvent.dateAndTime.split("at")[0])

                response.forEach((event: EventType) => {
                    const currentDate = new Date(event.dateAndTime.split("at")[0])
                    if (currentDate < nextEventDate) {
                        nextEvent = event
                        nextEventDate = currentDate
                    }
                })

                const date = nextEvent.dateAndTime.split("at")[0]
                const time = nextEvent.dateAndTime.split("at")[1]
                let eventString: string =
                    `**The next event is:**\n\n` +
                    `  \`${nextEvent.name}\` on **${date}**${time ? `at**${time}**` : ""}\n\n` +
                    `   Location:  \`${nextEvent.location}\`\n\n` +
                    `${nextEvent.googleMapsURL}\n\n\n`
                await interaction.reply({ content: eventString, ephemeral: true })

            } else {
                await interaction.reply({ content: "There are no upcoming events!", ephemeral: true })
            }

        }
    } catch (error) {
        console.log("Error in event")
    }
}

const handleJoinCommand = async (interaction: ChatInputCommandInteraction) => {
    const eventName = interaction.options.getString("eventname")
    const userName = interaction.user.id
    const response = await EventModel.findOneAndUpdate(
        { name: { $regex: eventName, $options: 'i' } },
        { $addToSet: { usersAttending: [userName] } }
    )
    if (response) {
        await interaction.reply({ content: `Successfully registered for \`${eventName}\``, ephemeral: true })
        return;
    }
    await interaction.reply({ content: `Error: Could not register for \`${eventName}\``, ephemeral: true })
}
const handleMembersCommand = async (interaction: ChatInputCommandInteraction) => {
    const eventName = interaction.options.getString("eventname")
    const event: EventType | null = await EventModel.findOne({ name: { $regex: eventName, $options: 'i' } })

    if (event) {

        if (event.usersAttending.length > 0) {
            let returnString =
                `**Here are all users currently registered for \`${eventName}\`**\n\n`

            event.usersAttending.forEach((user: string) => {
                returnString += `<@${user}>\n\n`
            })
            await interaction.reply({ content: returnString, ephemeral: true })

        } else {
            await interaction.reply({ content: `**There are no members currently registered for \`${eventName}\`**`, ephemeral: true })
        }
        return;
    }

    await interaction.reply({ content: `**Error: Could not find \`${eventName}\`**`, ephemeral: true })

}
const handleLeaveCommand = async (interaction: ChatInputCommandInteraction) => {
    const eventName = interaction.options.getString("eventname")
    const userName = interaction.user.id

    const response = await EventModel.findOneAndUpdate(
        { name: { $regex: eventName, $options: 'i' } },
        { $pull: { usersAttending: userName } }
    )

    if (response) {
        await interaction.reply({ content: `**Successfully left \`${eventName}\`**`, ephemeral: true })
        return;
    }

    await interaction.reply({ content: `**Error: Could not leave \`${eventName}\`**`, ephemeral: true })

}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("event")
        .setDescription("Event commands for non-admin")
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Choose which events to list')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Which events to list')
                        .setRequired(true)
                        .addChoices(
                            { name: 'all', value: 'all' },
                            { name: 'next', value: 'next' },
                        ))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('register')
                .setDescription('Choose which event to join')
                .addStringOption(option =>
                    option.setName('eventname')
                        .setDescription('Enter name of event')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Choose which event to leave')
                .addStringOption(option =>
                    option.setName('eventname')
                        .setDescription('Enter name of event')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('members')
                .setDescription('List all members attending a certain event')
                .addStringOption(option =>
                    option.setName('eventname')
                        .setDescription('Enter name of event')
                        .setRequired(true)
                )
        )
    ,

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand()

        switch (subcommand) {
            case ("list"): {
                handleListCommand(interaction)
                return;
            }
            case ("register"): {
                handleJoinCommand(interaction)
                return;
            }
            case ("members"): {
                handleMembersCommand(interaction)
                return;
            }
            case ("leave"): {
                handleLeaveCommand(interaction)
                return;
            }
        }
    }
}