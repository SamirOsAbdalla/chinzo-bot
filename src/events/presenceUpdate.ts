import { Presence, Client, Events } from "discord.js"


module.exports = {
    name: Events.PresenceUpdate,
    execute(client: Client, presence: Presence) {
        // presence?.activities.forEach(activity => {
        //     if (activity.name == "League of Legends") {
        //         const user = client.users.cache.get(presence.userId)
        //         user?.send("Get off league right now or else")
        //     }
        // })
    }

}