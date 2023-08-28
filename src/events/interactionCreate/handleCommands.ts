import { Client, Interaction } from "discord.js"
import { testServer, devs } from "../../../config.json"
import getLocalCommands from "../../utils/getLocalCommands";

module.exports = async (client: Client, interaction: any) => {
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

        await commandObject.callback(client, interaction)
    } catch (error) {
        console.log(`Error in handle commands ${error}`)
    }

}