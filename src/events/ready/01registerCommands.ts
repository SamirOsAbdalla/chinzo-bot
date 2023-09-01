import { Client, Collection, Snowflake, ApplicationCommand } from "discord.js"
import { testServer } from "../../../config.json"
import getLocalCommands from "../../utils/getLocalCommands"
import getApplicationCommands from "../../utils/getApplicationCommands"
import areCommandsDifferent from "../../utils/areCommandsDifferent"
module.exports = async (client: Client) => {

    try {
        const localCommands = getLocalCommands()
        const stringServer = "" + testServer
        const applicationCommands = await getApplicationCommands(client, stringServer)

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand

            const existingCommand = await applicationCommands?.cache?.find(
                (cmd: any) => cmd.name === name
            )
            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands?.delete(existingCommand.id);
                    console.log(`Deleted command ${name}`)
                    continue
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands?.edit(existingCommand.id, {
                        description,
                        options
                    })
                    console.log(`Edited command ${name}`)
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`SKIPPING REGISTERING '${name}'`)
                    continue;
                }

                await applicationCommands?.create({
                    name,
                    description,
                    options
                })

                console.log(`${name} was registered`)
            }

        }

    } catch (error) {
        console.log(`Error: ${error}`)
    }
}