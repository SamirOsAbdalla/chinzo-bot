import {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType, ModalBuilder,
    TextInputBuilder, TextInputStyle,
    ActionRowBuilder, PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import TrackModel from "../../models/Track";
import { Track, TrackTime } from "../../models/Track"




const addTrack = async (i: ChatInputCommandInteraction) => {
    const trackName = i.options.getString("name")
    const response = await TrackModel.create({ name: trackName })
    if (response) {
        await i.reply({ content: `**Success!** Created track \`${trackName}\``, ephemeral: true })
        return
    }
    await i.reply({ content: `**ERROR!** Could not create track \`${trackName}\``, ephemeral: true })
}

const timeConversion = (time: string) => {
    const hoursAndMinutesLength = 2;
    const millisecondsLength = 4;

    let timeArr = time.split(":")
    const t0Length = timeArr[0].length
    const t1Length = timeArr[1].length
    const t2Length = timeArr[2].length
    timeArr[0] = timeArr[0].padStart(t0Length + (hoursAndMinutesLength - t0Length), '0')
    timeArr[1] = timeArr[1].padStart(t1Length + (hoursAndMinutesLength - t1Length), '0')
    timeArr[2] = timeArr[2].padStart(t2Length + (millisecondsLength - t2Length), '0')
    return timeArr.join("")

}
const updateTrack = async (i: ChatInputCommandInteraction) => {
    const trackName = i.options.getString("name")
    const doesTrackExist = await TrackModel.findOne({ name: { $regex: trackName, $options: 'i' } })
    if (doesTrackExist) {
        const updateModal = new ModalBuilder()
            .setTitle(`Update ${trackName}`)
            .setCustomId("updatetrack")
        const driverName = new TextInputBuilder()
            .setCustomId("drivername")
            .setLabel("Driver Name")
            .setStyle(TextInputStyle.Short)
        const driverTime = new TextInputBuilder()
            .setCustomId("drivertime")
            .setLabel("Driver Time (Minutes:Seconds:Milliseconds)")
            .setStyle(TextInputStyle.Short)
        const carModel = new TextInputBuilder()
            .setCustomId("carmodel")
            .setLabel("Car Model")
            .setStyle(TextInputStyle.Short)
        const tires = new TextInputBuilder()
            .setCustomId("tires")
            .setLabel("Tires")
            .setStyle(TextInputStyle.Short)

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(driverName);
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(driverTime);
        const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(carModel);
        const fourthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(tires);

        updateModal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow)
        await i.showModal(updateModal)

        try {
            const modalResponse = await i.awaitModalSubmit({
                time: 900000,
                filter: interaction => i.user.id === interaction.user.id,
            })


            if (modalResponse?.isModalSubmit()) {
                const fields = modalResponse.fields
                const name = fields.getField("drivername").value
                const time = fields.getField("drivertime").value
                const model = fields.getField("carmodel").value
                const tires = fields.getField("tires").value

                const newTrackTime: TrackTime = {
                    timeHolder: name,
                    time,
                    carModel: model,
                    convertedTime: timeConversion(time),
                    tires
                }
                const updateResponse = await TrackModel.findOneAndUpdate(
                    { name: { $regex: trackName, $options: 'i' } },
                    { $push: { trackTimes: newTrackTime } }
                )

                if (updateResponse) {
                    await modalResponse.reply({ content: `**Success!** Updated track \`${trackName}\``, ephemeral: true })
                    return
                }
                await modalResponse.reply({ content: `**ERROR!** Could not update track \`${trackName}\``, ephemeral: true })


            }
        }
        catch (error) {
            console.log(error)
        }
        return;
    }
    await i.reply({ content: `**ERROR!** Could not find track \`${trackName}\``, ephemeral: true })
}


const deleteTrack = async (i: ChatInputCommandInteraction) => {
    const trackName = i.options.getString("trackname")
    const response = await TrackModel.deleteOne({ name: { $regex: trackName, $options: 'i' } })

    if (response.deletedCount > 0) {
        await i.reply({ content: `**Success!** Deleted track \`${trackName}\``, ephemeral: true })
        return
    }
    await i.reply({ content: `**ERROR!** Could not delete/find track \`${trackName}\``, ephemeral: true })
}

const deleteTrackTime = async (i: ChatInputCommandInteraction) => {
    const trackName = i.options.getString("nameoftrack")
    const doesTrackExist = await TrackModel.findOne({ name: { $regex: trackName, $options: 'i' } })
    if (doesTrackExist) {
        const deleteModal = new ModalBuilder()
            .setTitle(`Delete a track time for ${trackName}`)
            .setCustomId("deletetracktime")

        const driverName = new TextInputBuilder()
            .setCustomId("deletedrivername")
            .setLabel("Driver Name")
            .setStyle(TextInputStyle.Short)

        const carModel = new TextInputBuilder()
            .setCustomId("deletecarmodel")
            .setLabel("Car Model")
            .setStyle(TextInputStyle.Short)
        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(driverName);
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(carModel);
        deleteModal.addComponents(firstActionRow, secondActionRow)
        await i.showModal(deleteModal)
        try {
            const modalResponse = await i.awaitModalSubmit({
                time: 900000,
                filter: interaction => i.user.id === interaction.user.id,
            })


            if (modalResponse?.isModalSubmit()) {
                const fields = modalResponse.fields
                const driverName = fields.getField("deletedrivername").value
                const carModel = fields.getField("deletecarmodel").value

                const updateResponse = await TrackModel.findOneAndUpdate(
                    { name: { $regex: trackName, $options: 'i' } },
                    { $pull: { trackTimes: { timeHolder: { $regex: driverName, $options: 'i' }, carModel: { $regex: carModel, $options: 'i' } } } }
                )

                if (updateResponse) {
                    await modalResponse.reply({ content: `**Success!** Deleted track time for \`${driverName}\` from \`${trackName}\``, ephemeral: true })
                    return
                }
                await modalResponse.reply({ content: `**ERROR!** Could not delete track time for ${driverName} from \`${trackName}\``, ephemeral: true })


            }
        }
        catch (error) {
            console.log(error)
        }
        return;

    }
    await i.reply({ content: `**ERROR!** Could not find track \`${trackName}\``, ephemeral: true })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("track")
        .setDescription("Add, update, or delete a current track")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a new track')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Name of new track')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('update')
                .setDescription('Update a track')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Name of the track')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a track')
                .addStringOption(option =>
                    option.setName('trackname')
                        .setDescription('Name of the track')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deletetracktime')
                .setDescription('Delete a track time from a certain track')
                .addStringOption(option =>
                    option.setName('nameoftrack')
                        .setDescription('Name of the track')
                        .setRequired(true))
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const trackCommand = interaction.options.getSubcommand()

        switch (trackCommand) {
            case ("add"): {
                addTrack(interaction)
                return;
            }
            case ("update"): {
                updateTrack(interaction)
                return;
            }
            case ("delete"): {
                deleteTrack(interaction)
                return;
            }
            case ("deletetracktime"): {
                deleteTrackTime(interaction)
                return;
            }
        }
    }
}