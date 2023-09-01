import {
    Client, Interaction, EmbedBuilder,
    ButtonBuilder, ButtonStyle, ActionRowBuilder,
    ComponentType, ButtonInteraction, CacheType,
    InteractionResponse, userMention, ChatInputCommandInteraction,
    Events
} from "discord.js"
import { testServer, devs } from "../../config.json"
import { Player, GuildQueue, Track } from "discord-player";
import { YouTubeExtractor } from "@discord-player/extractor";
import getCommands from "../utils/getCommands";
import { clientCommands } from "../Bot";
let i = 0;
let player: Player;
const playerMusicLogic = async (client: Client, interaction: any, queue: GuildQueue<any>, track: Track<unknown>) => {

    const skipButton = new ButtonBuilder()
        .setCustomId('skip')
        .setLabel(`Skip`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({ name: "⏩" })

    const pauseButton = new ButtonBuilder()
        .setCustomId('pause')
        .setLabel(`Pause`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({ name: "⏯️" })

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(skipButton, pauseButton);

    const videoEmbed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle(`Playing: ${track.title}`)
        .setThumbnail(track.thumbnail)
        .setDescription(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 00:00/${track.duration}`)
        .addFields({ name: 'Requester', value: `<@${interaction.user.id}>` })


    // we will later define queue.metadata object while creating the queue
    const response: InteractionResponse<boolean> = await queue.metadata.channel.send({ embeds: [videoEmbed], components: [row] });
    try {

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: track.durationMS })

        collector.on("collect", async (i: ButtonInteraction<CacheType>) => {
            switch (i.customId) {
                case ("skip"): {
                    queue.node.skip();
                    collector.emit("end")
                    break;
                }
                case ("pause"): {
                    if (queue.node.isPaused()) {
                        await i.reply({ content: `<@${i.user.id}> | You have unpaused. Enjoy!`, ephemeral: true })
                        queue.node.resume()

                    } else {
                        await i.reply({
                            content: `<@${i.user.id}> |  You have paused.`, ephemeral: true,
                        })
                        queue.node.pause();
                    }
                    break;
                }
                default:
                    break;
            }
        })

        collector.on("end", async (collected: any) => {
            if (response) {
                await response.delete()

            }
        })

    } catch (e) {
        console.log(e)
        await interaction.editReply({ content: 'Error with video' });
    }
};




module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction) {

        if (i == 0) {

            i++;
            player = new Player(interaction.client)
            await player.extractors.register(YouTubeExtractor, {})

            player.events.on('playerStart', (queue, track) => {
                playerMusicLogic(interaction.client, interaction, queue, track)
            });
        }

        if (!interaction.isChatInputCommand()) return;
        const command = clientCommands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            if (interaction.commandName == "play") {
                await command.execute(interaction, player);
            } else {
                await command.execute(interaction);

            }
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }

}