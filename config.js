//Create the config var
var config = {
	twitch: {
		options: {
			debug: true
		 },
		connection: {
			random: "chat",
			reconnect: true
		},
		identity: {
			username: "bingKey",
			password: "oauth:93fvomytxtbpdybdifvaz64fyntz1i"
		},
		channels: ["#scrubing"]
	},
	cleverbotIO: {
		apiUser: "1ZNcx2ewRYMvAjzc",
		apiKey: "HMq2PsvlMTF4EXivkwtqNETVGmTYU7FS"
	},
	chatbot: {
		triggers: {
			directMention: true,
			randomResponseChance: 3
		},
		options: {
			useNamedResponse: true,
			fullMoonCrazy: false
		}
	}
};

//Make the config var available when imported with require()
module.exports = config;