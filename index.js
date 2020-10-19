const Discord = require('discord.js');
const fs = require('fs');
const config = require('./data/config.json');

const client = new Discord.Client();


const cooldowns = new Discord.Collection();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
    cooldowns.set(command.name, new Discord.Collection());
}


client.once('ready', () => {
    console.log(`${client.user.tag} is online`)
})


client.on('message', message => {

    const prefix = config.prefix;
    const args = message.content.slice(prefix.length).split(/ +/);

    const commandCalled = args.shift().toLowerCase();
    const command = client.commands.get(commandCalled) || client.commands.find(commandLOCAL => commandLOCAL.otherNames && commandLOCAL.otherNames.includes(commandCalled));



    if(!command || message.author.bot) return;


    if (command.args && !args.length) {
        let returnval = 'No Arguments provided';

        if(command.usage) {
            returnval += `\nTry : ${prefix}${command.name} ${command.usage}`
        }

        return message.channel.send(returnval);
    }


    if(command.guildOnly && message.channel.type === 'dm'){
        return message.channel.send('Cannot execute this command inside DMs');
    }


    const StartTime = Date.now();
    const timestamp = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamp.has(message.author.id)) {
        const expirationTime = timestamp.get(message.author.id) + cooldownAmount;

	    if (StartTime < expirationTime) {
		    const timeLeft = (expirationTime - StartTime) / 1000;
		    return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }else{
        timestamp.set(message.author.id, StartTime);
        setTimeout(() => timestamp.delete(message.author.id), cooldownAmount);
    }


    if(command.adminOnly) {
        if(!config.admins.includes(message.author.id.toString())) {
            console.log(message.author.id);
            return message.channel.send('You are not permitted to use this command.')
        }
    }



    try {
        command.execute(message, args);
    } catch(error){
        console.log(`Error thrown trying to execute "${commandDISCORD}"`)
        console.error(error);
    }
})

client.login(config.token);