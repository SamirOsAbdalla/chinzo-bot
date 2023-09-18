GreasyBot is a bot developed for the Greasy Gators discord server. The bot utilizes
the DiscordJS API as well as NodeJS, Typescript and MongoDB in order to provide
fun and useful commands to interact with while on the server.

## Commands List

**/help:** Lists all current commands along with their descriptions

**/numonline:** Displays the number of people with an "online" status

**/online:** Determines if a specified user is online

**/play:** Given a youtube URL, video name, etc., GreasyBot will play the video in the user's voice channel.

**/rock:** Sends out a game of rock, paper, scissors. Anyone can join in or you can play against Greasy!

**/tracktime:** Displays times for a certain track. Use "list" in the options to see all available tracks

**/track:** Admin only. Use this to add, delete or update a track. Stores all information in a MongoDB database

**/poll:** Admin only. Use this to create a new poll for members to vote on.

## Other functionality

- Notifies all members in the server when a new event is created. Auto-formats event details
so that members can easily find important details

- Sends auto-welcome messages so that every new member is greeted properly

- Members can control which current song is playing using a modal that is sent when a 
new video is played