const config = require('../data/config.json');
const Discord = require('discord.js');

module.exports = {
    name : 'help',
    description : 'A neat little command that lists all commands or explains one in detail.',
    args : false,
    usage : '<command>',
    guildOnly : false,
    cooldown : 5,
    otherNames : ['commands'],
    adminOnly : false,

    execute(message, args){
       const { commands } = message.client;

       function uppercaseFirstLetter(string) {return string.charAt(0).toUpperCase() + string.slice(1)}


        if(!args.length){
            const HelpEmbed = new Discord.MessageEmbed()
                .setColor('#1cd2d9')
                .setTitle('*List Of All Commands*')
                .setDescription(':green_book: ⋙ **For All**\n:closed_book: ⋙ **Only Admin**\n ︀︀ ︀︀ ︀︀')
                .addField('**⌈--Commands--⌉**', commands.map(command => command.adminOnly ? ':closed_book: ' + uppercaseFirstLetter(command.name) : ':green_book: ' + uppercaseFirstLetter(command.name)))
                .addField('**⌊--Commands--⌋**', ' ︀︀')

            return(message.author.send(HelpEmbed))
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent you a DM with all my commands!');
            })
            
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
            });
        }

        const commandCalled = args[0].toLowerCase();
        const command = commands.get(commandCalled) || commands.find(commandLOCAL => commandLOCAL.otherNames && commandLOCAL.otherNames.includes(commandCalled));


        if (!command) {
	        return message.reply('that\'s not a valid command!');
        }

        const CmdEmbed = new Discord.MessageEmbed()
            .setColor('#1cd2d9')
            .setTitle(`*Command : ${uppercaseFirstLetter(command.name)}*`)
            
            if(command.description != null){
                CmdEmbed.addField('Description', command.description)
            }
            if(command.usage != null){
                CmdEmbed.addField('Usage', `${config.prefix}${command.name} ${command.usage}`)
            }
            if(command.cooldown != null){
                CmdEmbed.addField('Cooldown', `${command.cooldown || 3} second(s)`)
            }
            if(command.adminOnly != null){
                CmdEmbed.addField('Permissions', command.adminOnly ? ':closed_book: Only Admins' : ':green_book: Everyone')
            }
            if(command.otherNames != null){
                CmdEmbed.addField('Other Names', `${command.otherNames.map(otherName => uppercaseFirstLetter(otherName)).join('\n')}`)
            }

            message.channel.send(CmdEmbed);
    }

}