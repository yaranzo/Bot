//Get the libs
var irc = require("tmi.js"); //Twitch API - Docs: http://www.tmijs.org/docs/
var cleverbotIO = require("cleverbot.io"); //CleverbotIO API - Docs: https://docs.cleverbot.io/v1.0/docs
require("prototypes"); //Adds a bunch prototype JS functions e.g. string.startsWith();
var SunCalc = require("suncalc"); //Used for grabbing the moon-phase for full-moon shenanigans
var zalgo = require("zalgify"); //Used to 'glitch out' text near the full-moon - Test Page: http://dmcc.co/zalgify/

//Get the config
var config = require("./config.js");

//Setup the twitch chatbot
var chatbot = new irc.client(config.twitch);
chatbot.connect(); //Connect to Twitch

//Setup the cleverbotIO API bot
cleverbot = new cleverbotIO(config.cleverbotIO.apiUser, config.cleverbotIO.apiKey);
cleverbot.create(function (err, session) { //Create the session
	if (err) { //if there was an error creating the session
		console.log("Error creating cleverbotIO session: " + err + " | " + "session: " + session);
	} else {
		console.log("cleverbotIO session created: " + session);
		cleverbot.setNick(session);
	}
}); 

//Event Listeners
//When connecting to a channel
chatbot.on("roomstate", function (channel, state) { 
	chatbot.action(channel, "Hi :)");
});

//When something is said
chatbot.on("chat", function (channel, user, message, self) { 
	var shouldRespond = false; //Default to not responding
	
	//Do different checks to see if ClevererBot should say something
	if (directlyMentioned(message)) { //Check if someone said "@bingKey, " at the start
		shouldRespond = true;
		console.log("directlyMentioned() responded true");
	} else if (randomlyRespond(user)) { //Check whether to randomly respond to someone
		shouldRespond = false;
		console.log("randomlyRespond() responded true");
	}
	
	//Time to make a response!
	if (shouldRespond == true) { //if any of the above checks responded yes
		//Use regex to remove botname in message if directly mentioned e.g. "Bot, do this." -> "do this."
		var re = new RegExp("^(?:" + config.twitch.identity.username + "\\W*\\b)?(.*)$", "i");
		var messageToAsk = re.exec(message)[1]; //Grab the only substring from the executed regex
	
		console.log("Asking cleverbotIO API: " + messageToAsk);
		cleverbot.ask(messageToAsk, function (err, response) { //ask the cleverbotIO API
			if (err) { //if there's an error
				console.log("Error asking cleverbotIO: " + err + " | " + "response: " + response);
			} else { //if the response is a success
				var formattedResponse = formatResponse(response, user); //Format the response properly
				chatbot.say(channel, formattedResponse);
			}
		});
	}
});

//Functions
//Check if ClevererBot was mentioned at the start
function directlyMentioned(message) {
	//Check if the config declares the option properly
	if (typeof(config.chatbot.triggers.directMention) !== "boolean") { 
		return false; //if directMention isn't a boolean, it's set wrong
	} else if (!(config.chatbot.triggers.directMention)) {
		return false; //if directMention is set to false
	}
	//Otherwise directMention is set to true
	
	var messageCheck = message.toUpperCase(); //Make it case insensitive
	var nameCheck = config.twitch.identity.username.toUpperCase(); //e.g. "CLEVERERBOT"
	
	if (messageCheck.startsWith("@BINGKEY")) {
		return true;
	} else {
		return false;
	}
};

//Check whether to randomly respond
function randomlyRespond(user) {
	//Check if the config declares the option properly
	if (typeof(config.chatbot.triggers.randomResponseChance) !== "number") { 
		return false; //if config value isn't a number, it's set wrong
	} else if (config.chatbot.triggers.randomResponseChance < 0 || config.chatbot.triggers.randomResponseChance > 100) {
		return false; //if config value isn't between 0 and 100, it's set wrong
	}
	//Otherwise responseChance is set correctly

	//Check whether Clevererbot is triggering off itself
	var botName = config.twitch.identity.username.toUpperCase(); //e.g. "CLEVERERBOT"
	var msgSender = user.username.toUpperCase(); //e.g. "TWITCHGUY101"

	if (msgSender === botName) { //If the message was sent by Clevererbot, don't respond
		return false;
	}

	//If it's not triggering off itself, do the random number check
	var randomChance = config.chatbot.triggers.randomResponseChance; //Percentage chance to randomly respond
	var diceRoll = Math.floor(Math.random() * 100) + 1; //Get a number between 1 and 100
	
	if (diceRoll <= randomChance) {
		return true;
	} else {
		return false;
	}
};

//Format the response based on config settings
function formatResponse(response, user) {
	//Declare and prepare the formattedResponse var
	var formattedResponse = response;
	
	//Check if the config declared the option
	if (config.chatbot.options.useNamedResponse === true) { 
		//if useNamedResponse is enabled
		//Change first letter to lowercase except for I, since we'll be adding the username beforehand
		//e.g. "Let's go home." -> "let's go home."
		var formattedResponse = formattedResponse.replace(/^(\w{2,}|[^I])/, function(m) { return m.toLowerCase(); });
		
		//Add in the username and comma e.g. "Blue, let's go home."
		formattedResponse = user["display-name"] + ", " + formattedResponse;
	}
	
	
	//Check if the config declared the option
	if (config.chatbot.options.fullMoonCrazy === true) {
		var date = new Date() //Grab today's date
		var moonPhase = SunCalc.getMoonIllumination(date); //Calculate Moon's phase
		var moonCutoff = 0.9; //What cutoff of the moon phase we use to start turning crazy
		var maxZalgoFreq = 0.4; //How many distortions get added to the text at maximum full moon (0.0-1.0)
		var maxZalgoIntensity = 3; //How intense the distortions are at maximum full moon (0-20?)
		
		if (moonPhase.fraction >= moonCutoff) { //if it's close enough to the full moon
			var intensity = ((moonPhase.fraction-moonCutoff)/(1-moonCutoff)); //How intense to make things overall (0.0->1.0)]
			formattedResponse = zalgo.zalgify(formattedResponse, maxZalgoFreq*intensity, maxZalgoIntensity*intensity);
		}
	}
	
	if (formattedResponse) { //if something got formatted, return that
		return formattedResponse;
	} else { //otherwise return the original message back
		return response;
	}
};