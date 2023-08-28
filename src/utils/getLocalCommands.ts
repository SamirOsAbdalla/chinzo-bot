import * as path from "node:path"
import getAllFiles from "./getAllFiles"

const getLocalCommands = (exceptions = []) => {
    let localCommands: any[] = []

    const commandCategories = getAllFiles(path.join(__dirname, "..", "commands"), true)

    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory)

        for (const commandFile of commandFiles) {
            const commandObject: any = require(commandFile)

            if (exceptions.includes(commandObject.name as never)) {
                continue;
            }
            localCommands.push(commandObject)
        }
    }
    return localCommands
}
export default getLocalCommands