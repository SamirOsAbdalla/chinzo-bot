import { MessageReaction, Presence, User, Client, Events } from "discord.js"


module.exports = {
    name: Events.MessageReactionAdd,
    async execute(messageReaction: MessageReaction, user: User) {
        if ((messageReaction.message.channelId == "1161153030541025361" || messageReaction.message.channelId == "1161302246559072377") && messageReaction.emoji.name == '✅') {
            let role = await messageReaction.message.guild?.roles.cache.find(role => role.name == "Member")

            if (role) {
                await messageReaction.message.guild?.members.cache.get(user.id)?.roles.add(role)
            }
        }

    }

}