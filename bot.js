var AUTH = "auth+live+aca54cf2a8301e72b5f8c0f00d95a11536df9587";
var USERID = "4f0c9882a3f751170b00355a";
var ROOMID = "4e1b2a7a14169c1b670063cb";
var BONUSMESSAGES = [
    "I'm not really in the mood, but fine. I'll dance.",
    "Ohhh yeahhhh! Imma dance like it's my job.",
    "Dance bitches! UNTZ UNTZ UNTZ",
    "I was listening to this song way before it was cool. Damn right imma dance.",
    "As official arbiter of awesomeness, I hereby declare this track to be awesome.",
    "I'll dance whenever I damn well please. And right now, I damn well please.",
    "Who the fuck do you think you are, tellin' me to dance? What do I look like, your pet monkey? OK fine, I'll dance.",
    "Well, *I* hate this song. But you could cut the peer pressure in here with a knife, so imma dance."
];

var Twss = require('twss');
var Bot = require('ttapi');
var readline = require('readline');
var bot = new Bot(AUTH, USERID, ROOMID);

var lastSpeaker = "";
var inARow = 0;
var everyOther = 0;
var bonusMode = false;
var bonusVotes = 0;
var bonusVoters = {};
var timer = new Date().getTime();

bot.on('roomChanged', function(data) {
    bot.speak("All systems go, I guess.");
    //console.log()
});

bot.on('speak', function(data) {
    if(data.command == 'speak') {
        if(data.name == lastSpeaker) {
            inARow++;
            if(inARow >= 5) { bot.speak("Cool story bro."); }
        } else {
            lastSpeaker = data.name;
            inARow = 1;
        }
    }
    
    if(data.name.toLowerCase() != 'dngrbot') {
        var twssProb = Twss.prob(data.text);
        console.log(data.name + ": " + data.text + " (" + twssProb + ")");
        if(twssProb > .99) { console.log("THATS WHAT SHE SAID!"); }
        if(twssProb > .999) {
            everyOther = (everyOther + 1) % 2;
            var punc = (everyOther==0) ? '!' : '.';
            bot.speak("That's what she said"+punc);
        }
        
        if (data.text.match(/\*bonus/i) || data.text.match(/\*boner/i) || data.text.match(/\*wet/i) || 
            data.text.match(/\*benga/i) || data.text.match(/\*fap/i)) {
            updateBonus(data);
        } else if (data.text.match(/\*waxhole/i)) {
            bot.speak("Stick http://thewaxhole.com in your waxhole and thank me later.");
        } else if (data.text.match(/\*starttimer/i)) {
            timer = new Date().getTime();
            bot.speak("Okay, fine.");
        } else if (data.text.match(/\*stoptimer/i)) {
            var now = new Date().getTime();
            var elapsed = now - timer;
            bot.speak("It's been " + timeDiff(elapsed) + ".");
        } else if (data.text.match(/skrillex/i)) {
            bot.speak("Leave your Skrillex at the door or feel my wrath.");
        } else if (data.text.match(/dnb/i)) {
            bot.speak("Eww I hate dnb, too many screeches!");
        } else if (data.text.match(/beep beep/i)) {
            bot.speak(data.name+"'s got the keys to mah jeep!");
        } else if (data.text.match(/\/tableflip/i)) {
            bot.speak("/tablefix");
        } else if (data.text.match(/dngrbot/i)) {
            if (data.text.match(/surly/i)) {
                bot.speak("Yeah, I'm surly as fuck. What about it?");
            } else if (data.text.match(/thanks/i) || data.text.match(/thank you/i)) {
                bot.speak("Don't mention it. Seriously, don't fucking mention it again.");
            } else if (data.text.match(/shut up/i)) {
                bot.speak("You shut up, douche.");
            } else if (data.text.match(/mad/i)) {
                bot.speak("Not enough dead humans.");
            } else if (data.text.match(/how are you/i)) {
                bot.speak("Bite my shiny metal ass, "+data.name+"!");
            } else if (data.text.match(/missed you/i)) {
                bot.speak("Cool. I didn't miss you at all, "+data.name);
            } else {
                bot.speak("Hello, stupid human!");
            }
        }
    }
});

bot.on('newsong', function(data) {
    console.log(data.room.metadata.current_song);
    bonusMode = false; bonusVotes = 0; bonusVoters = {};
    if(data.room.metadata.current_song.metadata.artist.match(/skrillex/i)) {
        bot.remDj(data.room.metadata.current_dj, function() {
            bot.speak("No Skrillex on my watch! Take a seat.");
        });
    }
});

rl = readline.createInterface(process.stdin, process.stdout);
rl.on('line', function (line) {
    bot.speak(line);
});

function updateBonus(data) {
    if(!(data.name in bonusVoters)) {
        bonusVotes++;
        bonusVoters[data.name] = true;
    } else {
        bot.speak("@" + data.name + ": You already voted, dude.");
        return;
    }
    
    if(!bonusMode) {
        bonusMode = true;
        bot.speak(data.name + " says this track is extra awesome. Say *bonus if you agree.");
    } else if(bonusVotes == 3) {
        var message = BONUSMESSAGES[Math.floor(Math.random() * BONUSMESSAGES.length)];
        bot.speak(message);
        bot.vote('up');
    } else if(bonusVotes == 4) {
        bot.speak("Dude. Pay attention. I'm dancing already. Jeez.");
    } else if(bonusVotes == 5) {
        bot.speak("/seriousface Cut it out, or imma stop dancing.");
    } else if(bonusVotes == 6) {
        bot.speak("Seriously? You guys are clueless. I no longer feel like dancing.");
        bot.vote('down');
    }
}

function timeDiff(milliseconds) {
    var timeDiff = "";
    var days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    if(days > 0) { timeDiff += days + " days, "; milliseconds -= (days * 1000 * 60 * 60 * 24); }
    var hours = Math.floor(milliseconds / (1000 * 60 * 60));
    if(hours > 0) { timeDiff += hours + " hours, "; milliseconds -= (hours * 1000 * 60 * 60); }
    var minutes = Math.floor(milliseconds / (1000 * 60));
    if(minutes > 0) { timeDiff += minutes + " minutes, "; milliseconds -= (minutes * 1000 * 60); }
    var seconds = Math.floor(milliseconds / 1000);
    if(seconds > 0) { timeDiff += seconds + " seconds"; milliseconds -= (seconds * 1000); }
    return timeDiff;
}