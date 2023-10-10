import {
    EmbedBuilder, InteractionType,
    ChatInputCommandInteraction, GuildMember,
    SlashCommandBuilder, PermissionFlagsBits,
    ChannelType
} from "discord.js"


module.exports = {
    data: new SlashCommandBuilder()
        .setName("rules")
        .setDescription("Send out text in rules channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {

        const channels = await interaction.guild?.channels.fetch()

        const rulesChannel = channels?.find(channel => channel?.name == "rules")

        let rulesText =
            'Welcome to the Gator Greasers Automotive Club at SF State!\n\n' +

            `**__1) Be respectful__**\n` +
            '- Respect everyone including their cars\n' +
            '- no matter the difference in opinion etc treat people how you want to be treated\n\n' +

            '**__2) Keep it SFW__**\n' +
            '- NSFW/Adult/Pornographic/Gore material is not allowed\n\n' +

            '**__3) Do not spam__**\n' +
            '- Please refrain from sending multiple messages that are short one after another, with how big the club has gotten over the last year we must be mindful of the amount of clutter\n' +
            '- Please be mindful of what channel you are talking in and be sure to use the proper channels, check the pinned messages and channel description for more info on what each one is about or you can ask an officer!\n\n' +

            '**__4) No derogatory language __**\n' +
            '- Derogatory language is not allowed\n\n' +

            '**__5) No illegal activity is allowed __**\n' +
            '- Promoting or posting any illegal activity such as sideshows, street racing, street drifting, takeovers, are not allowed\n' +
            '- No burnouts, revving, peeling out, two stepping, doughnuts are allowed\n\n' +

            '*Rules are subject to change*'


        if (rulesChannel?.type == ChannelType.GuildText) {
            rulesChannel.send({ content: rulesText })
        }

    }
}