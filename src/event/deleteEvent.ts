import {
    Client, ChatInputCommandInteraction,
    ApplicationCommandOptionType, ModalBuilder,
    TextInputBuilder, TextInputStyle,
    ActionRowBuilder, PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import EventModel from "../models/Event";
import { EventType } from "../models/Event";



module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Delete an event")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('communityevent')
                .setDescription('Choose which community event to delete')
                .addStringOption(option =>
                    option.setName('eventname')
                        .setDescription('Name of community event')
                        .setRequired(true)),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const eventName = interaction.options.getString("eventname")
        const response = await EventModel.deleteOne({ name: eventName })
        if (response) {
            await interaction.reply({ content: `Successfully deleted \`${eventName}\``, ephemeral: true })
            return;
        }

        await interaction.reply({ content: `Could not delete \`${eventName}\``, ephemeral: true })
    }
}