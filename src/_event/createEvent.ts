import {
    Client, ChatInputCommandInteraction,
    ApplicationCommandOptionType, ModalBuilder,
    TextInputBuilder, TextInputStyle,
    ActionRowBuilder, PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import EventModel from "../models/Event";
import { EventType } from "../models/Event";




module.exports = {
    data: new SlashCommandBuilder()
        .setName("eventcreate")
        .setDescription("Create a new event here")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        const eventModal = new ModalBuilder()
            .setCustomId("eventmodal")
            .setTitle("Event Creator")

        const nameInput = new TextInputBuilder()
            .setCustomId("nameinput")
            .setLabel("Event Name")
            .setStyle(TextInputStyle.Short)
        const descriptionInput = new TextInputBuilder()
            .setCustomId("descinput")
            .setLabel("Event Description")
            .setStyle(TextInputStyle.Paragraph)
        const dateAndTime = new TextInputBuilder()
            .setCustomId("dateandtimeinput")
            .setLabel("Date and Time (MM/DD/YYYY at 00:00 am/pm)")
            .setStyle(TextInputStyle.Short)
        const googleMapsURL = new TextInputBuilder()
            .setCustomId("googlemapsinput")
            .setLabel("Google Maps URL")
            .setStyle(TextInputStyle.Short)
        const locationInput = new TextInputBuilder()
            .setCustomId("locationinput")
            .setLabel("Event Location")
            .setStyle(TextInputStyle.Short)


        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(dateAndTime);
        const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(googleMapsURL);
        const fourthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(locationInput);
        const fifthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

        eventModal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow)
        await interaction.showModal(eventModal)
        try {
            const modalResponse = await interaction.awaitModalSubmit({
                time: 900000,
                filter: i => i.user.id === interaction.user.id,
            }).catch(async (error) => {

                return null
            })

            if (modalResponse?.isModalSubmit()) {
                const fields = modalResponse.fields
                const name = fields.getField("nameinput").value
                const description = fields.getField("descinput").value
                const googleMapsURL = fields.getField("googlemapsinput").value
                const dateAndTime = fields.getField("dateandtimeinput").value
                const location = fields.getField("locationinput").value
                const eventBody: EventType = {
                    name,
                    description,
                    googleMapsURL,
                    location,
                    dateAndTime,
                    usersAttending: []
                }

                const response = await EventModel.create(eventBody)
                if (response) {
                    await modalResponse.reply({
                        content: `Success. Event \`${name}\` has been created!`, ephemeral: true
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}