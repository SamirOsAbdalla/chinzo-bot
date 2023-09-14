import {
    Client, GuildMember, ChannelType,
    ChatInputCommandInteraction, ComponentType,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    EmbedBuilder, ApplicationCommandOptionType,
    SlashCommandBuilder, PermissionFlagsBits,
    ModalBuilder, TextInputBuilder, TextInputStyle,
    ButtonInteraction, CacheType
} from "discord.js"


function assertsIsNumber(numFields: any): asserts numFields is number {
    if (typeof numFields !== "number") {
        throw new Error("Error. numFields is not a number")
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Poll actions for server")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new poll')
                .addIntegerOption(option =>
                    option
                        .setName('numfields')
                        .setDescription('Number of poll fields.')
                        .setRequired(true)
                        .setMinValue(2)
                        .setMaxValue(4)
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {


        //create modal that allows user to add fields


        let numFields = interaction.options.getInteger("numfields")
        assertsIsNumber(numFields)

        if (!numFields) {
            await interaction.reply({ content: "**ERROR:** Could not create poll.", ephemeral: true })
            return;
        }
        const randomId = Math.floor(Math.random() * 1000000000);
        const modalId = `pollmodal${randomId}`
        const pollModal = new ModalBuilder()
            .setTitle(`Create a new poll`)
            .setCustomId(modalId)

        const pollDescription = new TextInputBuilder()
            .setCustomId(`polldescription`)
            .setLabel(`Poll Inquiry`)
            .setStyle(TextInputStyle.Paragraph)
        const pollDescriptionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(pollDescription);
        pollModal.addComponents(pollDescriptionRow)


        //add only requested number of fields
        for (let i = 0; i < numFields; i++) {
            const field = new TextInputBuilder()
                .setCustomId(`field${i}`)
                .setLabel(`Field #${i + 1}`)
                .setStyle(TextInputStyle.Short)
            const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(field);
            pollModal.addComponents(actionRow)
        }

        let embedResponse: any

        await interaction.showModal(pollModal)


        const modalResponse = await interaction.awaitModalSubmit({
            time: 900000,
            filter: i => {
                return (i.user.id === interaction.user.id) && modalId == i.customId
            },
        })

        //collect all fields and make an embed based on them
        if (!modalResponse?.isModalSubmit()) {
            return;
        }

        if (modalResponse) {

            const fields = modalResponse.fields
            const description = fields.getField("polldescription").value
            //create embed to send with all poll fields
            let pollEmbed = new EmbedBuilder()
                .setColor("#FFFFFF")
                .setTitle("Poll Question:")
                .setDescription(description)
                .addFields({ name: '\u200B', value: '\u200B' })
            let pollRow = new ActionRowBuilder<ButtonBuilder>()


            try {
                const pollValuesMap = new Map<string, number>();
                for (let i = 0; i < numFields; i++) {
                    const fieldValue = fields.getField(`field${i}`).value
                    pollValuesMap.set(`field${i}`, 0);

                    const rowButton = new ButtonBuilder()
                        .setCustomId(`rowButton${i}`)
                        .setLabel(fieldValue)
                        .setStyle(i + 1);
                    pollRow.addComponents(rowButton)
                    pollEmbed.addFields({ name: `${fieldValue}`, value: `${pollValuesMap.get(`field${i}`)}`, inline: true },)
                }
                await modalResponse.reply({ content: "Poll created", ephemeral: true })



                embedResponse = await interaction.followUp({ embeds: [pollEmbed], components: [pollRow] })

                const pollCollector = embedResponse.createMessageComponentCollector({ componentType: ComponentType.Button, time: 2_000_000 })


                const userSet = new Set();

                //Collect member responses


                pollCollector?.on('collect', async (i: any) => {

                    if (userSet.has(i.user.username)) {
                        await i.reply({ content: "You have already voted. Noob", ephemeral: true })
                        return;
                    }

                    userSet.add(i.user.username)

                    //get respective field and update value by 1
                    let responseFieldId: string = `field${i.customId[i.customId.length - 1]}`
                    pollValuesMap.set(responseFieldId, ((pollValuesMap.get(responseFieldId) as number) + 1))

                    const embedFieldIndex = parseInt(responseFieldId[responseFieldId.length - 1]) + 1

                    const newEmbed = EmbedBuilder.from(pollEmbed)
                    const tmpFields: any = []
                    tmpFields.push({ name: '\u200B', value: '\u200B' })
                    for (let i = 0; i < numFields!; i++) {
                        const fieldValue = fields.getField(`field${i}`).value

                        const rowButton = new ButtonBuilder()
                            .setCustomId(`rowButton${i}`)
                            .setLabel(fieldValue)
                            .setStyle(i + 1);
                        pollRow.addComponents(rowButton)
                        tmpFields.push({ name: `${fieldValue}`, value: `${pollValuesMap.get(`field${i}`)}`, inline: true })
                    }

                    newEmbed.setFields(...tmpFields)

                    await embedResponse.edit({ embeds: [newEmbed] })
                    await i.reply({ content: "Thanks for voting!", ephemeral: true })
                })


            } catch (error) {
                console.log(error)
            }
        }


    }
}