import 'dotenv/config'
import { Client, Events } from "discord.js"
import getCommands from "../utils/getCommands"
import { REST, Routes } from "discord.js"
const rest = new REST().setToken(process.env.TOKEN!);
const commands = getCommands()

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log("Greasy Bot is online!")


    }

}