module.exports = {
    name : 'test',
    description : 'test',
    //Args = Eingabewerte, dh args = true -> command benötigt informationen die von dem user gegeben werden
    args : false,
    //wenn Args = true -> wenn user command falsch benutzt gibt usage an wie man ihn richtig benutzt  zb: ?kick <kickdauer> <user>
    usage : null,
    //ob man den command nur in einen server ausführen kann (guild = server)
    guildOnly : false,
    //cooldown = zeit die der command braucht um von den speziellen user nochmal benutzt zu werden
    cooldown : 5,
    //andere namen des commands (aliase)
    otherNames : ['idk', 'mhh jes'],
    //wer darf das benutzen
    adminOnly : true,

    execute(message, args){
        message.channel.send('return');
    }

}