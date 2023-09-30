import {
    EmbedBuilder, InteractionType,
    ChatInputCommandInteraction, GuildMember,
    SlashCommandBuilder
} from "discord.js"


module.exports = {
    data: new SlashCommandBuilder()
        .setName("pong")
        .setDescription("Will pong a member")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The ponged member's name")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString("name")

        const members = await interaction.guild?.members.fetch()
        const foundMember = members?.find(member =>
            member.user.globalName == name
        )
        if (foundMember) {

            foundMember.user.send({ content: "Pong" })

            return
        }

        await interaction.reply({ content: `**ERROR:** Could not find member \`${name}\``, ephemeral: true })

    }
}