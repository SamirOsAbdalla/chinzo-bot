import { Client, Interaction } from "discord.js"
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js"



module.exports = {
    name: "ban",
    description: "Bans a member",
    // devOnly: ,
    // testOnly: ,
    options: [
        {
            name: "target-user",
            description: "The user to ban",
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: "reason",
            description: "Reason for ban",
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: PermissionFlagsBits.Administrator,
    callback: (client: Client, interaction: any) => {
        interaction.reply(`Ban...`)
    }
}