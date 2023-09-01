import { Client } from "discord.js"
import * as path from "node:path"
import * as fs from "node:fs"
import { Player } from 'discord-player';



const eventHandler = (client: Client) => {
    const eventsPath = path.join(__dirname, "..", 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}
export default eventHandler