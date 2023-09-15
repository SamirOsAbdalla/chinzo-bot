import {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType, ModalBuilder,
    TextInputBuilder, TextInputStyle,
    ActionRowBuilder, PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import TrackModel from "../../models/Track";
import { Track, TrackTime } from "../../models/Track"



module.exports = {
    data: new SlashCommandBuilder()
        .setName("tracktime")
        .setDescription("List track times for a certain track")
        .addStringOption(option =>
            option.setName('name')
                .setDescription("Type 'list' to list all current tracks or a name for a certain track")
                .setRequired(true)),


    async execute(interaction: ChatInputCommandInteraction) {
        const trackName = interaction.options.getString("name")

        if (trackName == "list") {
            const allTracks = await TrackModel.find({})
            if (allTracks.length == 0) {
                await interaction.reply({ content: "There are no current tracks!", ephemeral: true })
                return;
            }
            let responseString =
                `**Here is a list of all of the current tracks**\n\n\n`
            allTracks.forEach((track, index) => {
                responseString += `${index + 1}: \`${track.name}\`\n\n`
            })
            await interaction.reply({ content: responseString, ephemeral: true })
        }
        else {
            const response: Track | null = await TrackModel.findOne({ name: { $regex: trackName, $options: 'i' } })
            if (response) {
                const trackTimes = response.trackTimes
                let longestNameLength = -1;
                if (trackTimes.length > 0) {

                    const sortedTrackTimes = trackTimes.sort((t1: TrackTime, t2: TrackTime) => {


                        if (t1.timeHolder.length > longestNameLength) {
                            longestNameLength = t1.timeHolder.length
                        }
                        return (t1.convertedTime > t2.convertedTime) ? 1 : -1;
                    })

                    let responseString =
                        `Here are all the track times for **${trackName}**\n\n\n`

                    sortedTrackTimes.forEach((track: TrackTime) => {
                        let trackLength = track.time.length - 2
                        let numSpaces = 7 - trackLength
                        let spaces: string = " ";
                        for (let i = 0; i < numSpaces; i++) {
                            spaces += "  "
                        }


                        responseString += `\`${track.time}\`${spaces} **${track.timeHolder}**  *${track.carModel}*\n\n`
                    })

                    await interaction.reply({ content: responseString, ephemeral: true })
                } else {
                    await interaction.reply(
                        {
                            content: `There are currently no track times associated with track \`${trackName}\``,
                            ephemeral: true
                        })
                }

                return
            }

            await interaction.reply({ content: `**ERROR!** Could not find track \`${trackName}\``, ephemeral: true })
        }

    }
}