import {
    Client, ChatInputCommandInteraction,
    ApplicationCommandOptionType, ModalBuilder,
    TextInputBuilder, TextInputStyle,
    ActionRowBuilder,
} from "discord.js";
import EventModel from "../../models/Event";
import { Event } from "../../models/Event";


const eventCreate = async (interaction: ChatInputCommandInteraction) => {
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
    const dateInput = new TextInputBuilder()
        .setCustomId("dateinput")
        .setLabel("Event Date")
        .setStyle(TextInputStyle.Short)
    const timeInput = new TextInputBuilder()
        .setCustomId("timeinput")
        .setLabel("Event Time")
        .setStyle(TextInputStyle.Short)
    const locationInput = new TextInputBuilder()
        .setCustomId("locationinput")
        .setLabel("Event Location")
        .setStyle(TextInputStyle.Short)


    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput);
    const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput);
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
            const location = fields.getField("locationinput").value
            const date = fields.getField("dateinput").value
            const time = fields.getField('timeinput').value

            const eventBody: Event = {
                name,
                description,
                location,
                date,
                time,
                usersAttending: []
            }

            const response = await EventModel.create(eventBody)
            if (response) {
                await modalResponse.reply({
                    content: `Thank you for submitting. Event \`${name}\` has been created!`, ephemeral: true
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    name: "event",
    description: "Handle all server events here",
    options: [
        {
            name: "create",
            description: "Create new event",
            required: false,
            type: ApplicationCommandOptionType.String
        },
        {
            name: "list",
            description: "List events",
            choices: [{ name: "all", value: "all" }, { name: "next", value: "next" }],
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {

        const optionsCreate = interaction.options.get("create")
        console.log(optionsCreate)
        const optionsList = interaction.options.getString("list")
        console.log(optionsList)

        if (optionsCreate) {
            eventCreate(interaction)
        } else if (optionsList) {
            if (optionsList == "all") {
                const allEvents = await EventModel.find({})
                return;
            }
        }

    }
}