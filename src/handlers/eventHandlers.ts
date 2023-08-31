import { Client } from "discord.js"
import getAllFiles from "../utils/getAllFiles"
import * as path from "node:path"
import { Player } from 'discord-player';



const eventHandler = (client: Client) => {
    const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true)
    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder)

        eventFiles.sort((a, b) => {
            if (a > b) {
                return 1;
            }

            return -1;
        })

        const eventName = eventFolder.replace(/\\/g, "/").split("/").pop()
        client.on(eventName as string, async (arg) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile)
                await eventFunction(client, arg)
            }
        })
    }
}
export default eventHandler