import {
    Client, GuildMember, ChannelType,
    ChatInputCommandInteraction, ComponentType,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    EmbedBuilder
} from "discord.js"
import findTextChannel from "../../utils/findTextChannel"

type Player = {
    action: string,
    playerName: string
}
const determineWinner = (player1: Player, player2: Player): { winner: string, loser: string } | undefined => {

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
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {

        let rockEmbed = new EmbedBuilder()
            .setColor("#d59342")
            .setTitle("Play rock, paper, scissors against another player")
            .setAuthor({ name: "Chinzo" })

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

        const response = await interaction.reply({ embeds: [rockEmbed], components: [row] })

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000 });

        let values: Player[] = [];

        collector.on('collect', async (i) => {

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

    }
} 