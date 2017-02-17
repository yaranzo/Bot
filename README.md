# Clevererbot-twitch

Clevererbot chatbot for use on twitch.tv, uses the cleverbot.io API and is written in Node<span>.js</span>. 

It can be found [on NPM](https://www.npmjs.com/package/clevererbot-twitch) for easy installation.

## Config
There is a sample config file that comes supplied, you will need to make a copy of it and rename it from `config.example.js` to just `config.js`.

----

+ `config.twitch`  
This connection information is for tmi.js, documentation found [here](http://www.tmijs.org/docs/Configuration.html).

+ `config.cleverbotIO`  
This is your API key info for cleverbot.io, you can signup/find that [here](https://cleverbot.io/keys).

+ `config.chatbot`  
This is the section for customising how your clevererbot chatbot will run.

    + `config.chatbot.triggers`  
    These are the ways clevererbot decides to talk.
    
    + `config.chatbot.triggers.directionMention` | *boolean* | *false/true*  
    This decides if clevererbot responds if directly named at the start of a chatmessage.  
    e.g. `"Clevererbot, how are you today?"` will prompt clevererbot to respond.  
      
    + `config.chatbot.triggers.randomResponseChance` | *number* | *0-100*  
    This the percentage chance for clevererbot to randomly respond to any message.  
    e.g. a value of `25` will make Clevererbot respond to a quarter of anything said in the channel.  
    Setting this value to `0` will disable random responses.  
    
    + `config.chatbot.options`  
    These are some other options you can use to adjust the behaviour of clevererbot.
      
      + `config.chatbot.options.useNamedResponse` | *boolean* | *false/true*  
      This decides whether clevererbot will say the username they're responding to. This is handy if clevererbot is taking a while to respond, or if there are multiple people talking to the bot at the same time.  
      e.g. `"Bluesatin, I'm good today."` will be said instead of just `"I'm good today."`.
      
      + `config.chatbot.options.fullMoonCrazy` | *boolean* | *false/true*  
      This decides if clevererbot goes a bit funky around full-moons by adding zalgofied text l̵̶ik̀é t̴͜h̨i̴͠s̵̕.  
      Currently the corruption strength variables are stored inside the function, they can be adjusted there.
