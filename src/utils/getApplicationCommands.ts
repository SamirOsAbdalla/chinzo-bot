import { Client, Collection, Snowflake, ApplicationCommand } from "discord.js"
import { clientId } from "../../config.json"
const getApplicationCommands = async (client: Client, guildId: string) => {


    if (guildId) {
        const guild = await client.guilds.fetch(guildId);
        let applicationCommands = await guild.commands
        await applicationCommands.fetch()
        return applicationCommands;
    } else {
        let applicationCommands = await client.application?.commands;
        await applicationCommands?.fetch()
        return applicationCommands
    }



}

export default getApplicationCommands