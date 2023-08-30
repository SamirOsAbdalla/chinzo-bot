import {
    Client, GuildMember, ChannelType,
    ChatInputCommandInteraction, ComponentType,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    EmbedBuilder, ApplicationCommandOptionType
} from "discord.js"
import findTextChannel from "../../utils/findTextChannel"

type Player = {
    action: string,
    playerName: string
}

type WinObject = {
    winner: string,
    loser: string
}

let actionArray = ["rock", "paper", "scissors"]

const determineWinner = (player1: Player, player2: Player): WinObject | undefined => {

    switch (player1.action) {
        case ("rock"): {
            if (player2.action == "rock") {
                return undefined
            } else if (player2.action == "paper") {
                return { winner: player2.playerName, loser: player1.playerName }
            } else {
                return { winner: player1.playerName, loser: player2.playerName }
            }
        }
        case ("paper"): {
            if (player2.action == "rock") {
                return { winner: player1.playerName, loser: player2.playerName }
            } else if (player2.action == "paper") {
                return undefined
            } else {
                return { winner: player2.playerName, loser: player1.playerName }
            }
        }
        case ("scissors"): {
            if (player2.action == "rock") {
                return { winner: player2.playerName, loser: player1.playerName }
            } else if (player2.action == "paper") {
                return { winner: player1.playerName, loser: player2.playerName }
            } else {
                return undefined
            }
        }
        default:
            break;
    }
}


module.exports = {
    name: "rock",
    description: "Play a game of rock, paper, scissors against another player!",
    options: [
        {
            name: "playagainstchinzo",
            description: "Enter 'yes' to play against the one and only Chinzo",
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const rock = new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Primary);

        const paper = new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Primary);

        const scissors = new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(rock, paper, scissors);

        if (interaction.options.get("playagainstchinzo")?.value == "yes") {
            let rockEmbedChinzo = new EmbedBuilder()
                .setColor("#d59342")
                .setTitle("Play rock, paper, scissors against Chinzo!")
                .setAuthor({ name: "Chinzo" })

            const response = await interaction.reply({ embeds: [rockEmbedChinzo], components: [row], ephemeral: true })
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000 });

            const userName = interaction.user.username;
            collector.on('collect', async (i) => {
                const userAction = i.customId;
                const chinzoAction = actionArray[Math.floor(Math.random() * 3)]
                const winnerObject = determineWinner(
                    { action: chinzoAction, playerName: "Chinzo" },
                    { action: userAction, playerName: userName }
                )
                if (winnerObject?.winner == "Chinzo") {
                    await i.reply({ content: "Chinzo has beaten you. This is of course, to be expected.", ephemeral: true })
                } else if (winnerObject?.winner) {
                    await i.reply({ content: "You have actually beaten the great Chinzo!", ephemeral: true })
                } else {
                    await i.reply({ content: "You have tied against the almighty Chinzo.", ephemeral: true })
                }
            })
            collector.on('end', async (i) => {
                rock.setDisabled(true)
                paper.setDisabled(true)
                scissors.setDisabled(true)
                await response.edit({ components: [row] })
            })
        } else {
            let rockEmbed = new EmbedBuilder()
                .setColor("#d59342")
                .setTitle("Play rock, paper, scissors against another player")
                .setAuthor({ name: "Chinzo" })

            const response = await interaction.reply({ embeds: [rockEmbed], components: [row] })

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000 });

            let values: Player[] = [];

            collector.on('collect', async (i) => {

                if (values.length == 1) {
                    if (i.user.username == values[0].playerName) {
                        await i.reply({ content: "You have already chosen.", ephemeral: true })
                        return;
                    }
                }
                values.push({ action: i.customId, playerName: i.user.username })

                if (values.length == 2) {
                    let winnerObj = determineWinner(values[0], values[1]);
                    if (winnerObj) {
                        await i.reply(
                            { content: `${winnerObj.winner} has beaten ${winnerObj.loser} decisively!` }
                        )

                    } else {
                        await i.reply(
                            { content: `The match between ${values[0].playerName} and ${values[1].playerName} was a draw!` }
                        )
                    }
                    values = []
                } else {

                    await i.reply(
                        { content: `${values[0].playerName} has locked in their choice...` }
                    )
                }
            });

            collector.on('end', async collected => {
                rock.setDisabled(true)
                paper.setDisabled(true)
                scissors.setDisabled(true)
                await response.edit({ components: [row] })
            });
        }


    }
} 