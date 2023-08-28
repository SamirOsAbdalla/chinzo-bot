import { Client, Interaction } from "discord.js"


module.exports = {
    name: "ping",
    description: "Replies with 'Pong!'",
    // devOnly: ,
    // testOnly: ,
    // options:,
    callback: async (client: Client, interaction: any) => {
        await interaction.reply({ content: `Pong! ${client.ws.ping}ms`, ephemeral: true })
    }
}
