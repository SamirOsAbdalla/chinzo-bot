import { Client, Message } from "discord.js"


const createResponseMessage = (content: string, substring: string): string => {
    let numOccurrences = 0;
    let stepSize = 1;
    let position = 0;
    while (true) {
        position = content.indexOf(substring, position);
        if (position >= 0) {
            ++numOccurrences;
            position += stepSize;
        } else {
            break;
        }
    }

    let submitString = ""
    switch (substring) {
        case ("greasy bot"): {
            for (let i = 0; i < numOccurrences; i++) {
                if (i == 0) {
                    submitString += "I am Greasy."
                } else {
                    submitString += "Greasy"
                }
            }
            break;
        }
        case ("ping"): {
            for (let i = 0; i < numOccurrences; i++) {
                if (i == 0) {
                    submitString += "Pong"
                } else {
                    submitString += " Pong"
                }
            }
            break;
        }
        default:
            break;
    }

    return submitString
}
module.exports = async (client: Client, message: Message) => {

    const content = message.content.toLowerCase()
    if (!message.author.bot && content.includes("greasy bot")) {

        await message.reply(createResponseMessage(content, "greasy bot"))
    }

    if (!message.author.bot && content.includes("ping")) {
        await message.reply(createResponseMessage(content, "ping"))
    }
}