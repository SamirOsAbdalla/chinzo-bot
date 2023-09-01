import 'dotenv/config'
import * as fs from 'node:fs';
import * as path from "node:path"
import { Client, Collection, GatewayIntentBits } from "discord.js";
import eventHandler from "../src/handlers/eventHandlers"
import mongoose from 'mongoose';




const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
    ]
});


// Client and database login
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!)
        eventHandler(client)
        console.log("Connected to MongoDB database")
        client.login(process.env.TOKEN!)
    } catch (error) {
        console.log(error)
    }
})()

