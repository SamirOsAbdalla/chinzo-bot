import 'dotenv/config'
import { Client, Events } from "discord.js"
import getCommands from "./utils/getCommands"
import { REST, Routes } from "discord.js"

const commands = getCommands()
const rest = new REST().setToken(process.env.TOKEN!);
// and deploy your commands!
(async () => {
    try {
        let testServer = process.env.TEST_SERVER!
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set

        // const data = await rest.put(
        //     Routes.applicationGuildCommands(process.env.CLIENT_ID!, testServer),
        //     { body: commands },
        // );
        // // await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, testServer), 
        // { body: [] })

        // await rest.put(
        //     Routes.applicationCommands(process.env.CLIENT_ID!),
        //     { body: [] },
        // );

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands },
        );
        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(`Ready error:${error}`);
    }
})();