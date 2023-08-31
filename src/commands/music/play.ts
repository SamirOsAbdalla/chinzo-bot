import { Player } from "discord-player"
import {
    Client,
    ApplicationCommandOptionType, EmbedBuilder,
} from "discord.js"

module.exports = {
    name: "play",
    description: "Play a video from youtube",
    // devOnly: ,
    // testOnly: ,
    options: [
        {
            name: "query",
            description: "Type in a song to query",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    callback: async (client: Client, interaction: any, player: Player) => {

        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply({ content: 'You are not connected to a voice channel!', ephemeral: true }); // make sure we have a voice channel

        const query = interaction.options.getString('query', true); // we need input/query to play
        // let's defer the interaction as things can take time to process
        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    // nodeOptions are the options for guild node (aka your queue in simple word)
                    metadata: interaction // we can access this metadata object using queue.metadata later on
                }
            });

            return interaction.followUp(`<@${interaction.user.id}> | \u1CBCAdded \`${track.title}\` to the queue`);
        } catch (e) {
            // let's return error if something failed
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
}