import 'dotenv/config'
import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as fs from 'node:fs';
import * as path from "node:path"
import eventHandler from "../src/handlers/eventHandlers"
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

eventHandler(client)
client.login(process.env.TOKEN!)