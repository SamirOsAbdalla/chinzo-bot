import { Client, Message } from "discord.js"


module.exports = async (client: Client, message: Message) => {
    const content = message.content
    if (content.includes("chin")) {
        await message.reply("I AM CHINZO")
    }

    if (content.includes("ping")) {
        await message.reply("Pong!")
    }
}