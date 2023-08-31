import {
    Client, Interaction, EmbedBuilder,
    ButtonBuilder, ButtonStyle, ActionRowBuilder,
    ComponentType, ButtonInteraction, CacheType,
    InteractionResponse, userMention, ChatInputCommandInteraction
} from "discord.js"
import { testServer, devs } from "../../../config.json"
import getLocalCommands from "../../utils/getLocalCommands";
import { Player, GuildQueue, Track } from "discord-player";
import { YouTubeExtractor } from "@discord-player/extractor";

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
            await response.delete()
        })
    } catch (e) {
        console.log(e)
        await interaction.editReply({ content: 'Error with video' });
    }
};




module.exports = async (client: Client, interaction: any) => {
    if (i == 0) {
        i++;
        player = new Player(client)

        await player.extractors.register(YouTubeExtractor, {})

        player.events.on('playerStart', (queue, track) => {
            playerMusicLogic(client, interaction, queue, track)
        });
    }

    if (!interaction.isChatInputCommand()) {
        return;
    }

    const localCommands = getLocalCommands()

    try {

        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName)
        if (!commandObject) {
            return;
        }

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: "Only devs can run this command",
                    ephemeral: true
                })

                return;
            }
        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: "This command can't be ran here",
                    ephemeral: true
                })

                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "Not enough permissions",
                        ephemeral: true
                    })

                    return;
                }
            }
        }

        if (interaction.commandName == "play") {
            await commandObject.callback(client, interaction, player)
        } else {
            await commandObject.callback(client, interaction)

        }

    } catch (error) {
        console.log(`Error in handle commands ${error}`)
    }

}