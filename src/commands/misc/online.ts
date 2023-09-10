


import {
    InteractionType,
    ChatInputCommandInteraction, GuildMember,
    SlashCommandBuilder
} from "discord.js"


module.exports = {
    data: new SlashCommandBuilder()
        .setName("online")
        .setDescription("Determines if a certain user is online")
        .addStringOption(option =>
            option.setName("name")
                .setDescription('The desired users name')
                .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {

        const name = interaction.options.getString("name")

        const members = await interaction.guild?.members.fetch()
        const foundMember = members?.find(member =>
            member.user.globalName == name
        )

        if (foundMember) {

            await interaction.reply({ content: `User \`${name}\` is currently **${foundMember.presence?.status == "online" ? "online" : "offline"}**`, ephemeral: true })
            return
        }

        await interaction.reply({ content: `**ERROR:** Could not find member \`${name}\``, ephemeral: true })
    }
}