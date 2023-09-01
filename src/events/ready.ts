import 'dotenv/config'
import { testServer } from '../../config.json'

import { Client, Events } from "discord.js"
import getCommands from "../utils/getCommands"
import { REST, Routes } from "discord.js"
const rest = new REST().setToken(process.env.TOKEN!);
const commands = getCommands()
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        // console.log(commands)
        // await rest.put(
        //     Routes.applicationCommands(process.env.CLIENT_ID!),
        //     { body: [] },
        // );
        // await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, testServer), { body: [] })
        // const data = await rest.put(
        //     Routes.applicationGuildCommands(process.env.CLIENT_ID!, testServer),
        //     { body: commands },
        // );
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands },
        );
        console.log("Greasy Bot is online!")
    }

}