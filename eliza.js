/**
 * Ryan Baker & Alexander Briggs
 * Arizona State University
 * SER421 Fall B 2016
 * Lab 2
 */
'use strict';

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs');

var name = '';
var log = '';
var coffeeIntervalFlag = false;
var coffeeTime;
var questionTime;
var dictlist = ['elizadict.json']
var startQuestions = [
    'how is your day going?',
    'is something troubling you?',
    'you seem happy, why is that?',
    'what\'s up doc?',
    'hmmm... what should we talk about today?'
];
var slowPrompts = [
    ["", ", I'm waiting here!"],
    ["What's the matter ", ", cat got your tongue?"],
    ["Hey ", "! Are you there?"]
];

//set coffee timer
setCoffeeInterval();

//Read in initial dictionary file.
var elizadict = JSON.parse(fs.readFileSync('elizadict.json', 'utf8'));

//initial startup
say("What's your name?");
//setQuestionInterval();

//continuous talking
rl.on('line', function (line) {
    //they responded, clear the question timer
    clearInterval(questionTime);
    getResponse(line, function (ans) {
        say(ans);
    });
});



function getResponse (line, callback) {
    log += line+'\n';
    line = line.trim().toLowerCase();
    checkForFiles();
    switch (line) {
        case 'quit':
            //if the user wants to quit
            rl.close();
            process.exit();
        case 'maybe':
            if (coffeeIntervalFlag) {
                clearInterval(coffeeTime);
            }
            break;
        case '':
            return callback('Say more than nothing!');
        case 'log':
            return logConversation(callback);
    }
    //set thisflag to false
    coffeeIntervalFlag = false;

    //if it's the first response they're setting their name
    if ('' === name) {
        name = line;
        var i = rand(0, startQuestions.length-1);
        //setQuestionInterval();
        return callback('Hello '+line+', '+startQuestions[i]);
    }

    line = line.replace(/[^a-z ]/g, '');
    var words = line.split(' ');

    //search for words the dictionary and send an appropriate response
    var dictresponse = function(){
    	for(var i = 0; i < elizadict.length; i++){
        	var entry = elizadict[i];
        	for(var j = 0; j < entry.key.length; j++){
        		var keyword = entry.key[j];
        		for(var k = 0; k < words.length; k++){
        			if(words[k] == keyword){
        				var resp = entry.phrase[rand(0,(entry.phrase.length))];
        				//Move this keyword to the back of the dictionary.
        				elizadict.splice( i, 1 );
        				elizadict.push(entry);
        				return resp;
        			}
        		}
        	}
        }
    	//get a default response, assumes default is first entry.
    	return(elizadict[0].phrase[rand(0,(entry.phrase.length))]);
    }
    
    
    return callback(dictresponse());

    //return callback('The first word you said was '+words[0]);
}

//TODO: interval function to check for new files
//TODO: function to read in new file into our data structures

function coffeeInterval () {
    console.log();
    say('You sure can talk. I need some coffee - join me at Dunkin, '+name+'?');
    coffeeIntervalFlag = true;
    setTimeout(function () {
        coffeeIntervalFlag = false;
    }, 10000); //ten seconds for the user to respond
}

function questionInterval () {
    console.log();
    var i = rand(0, slowPrompts.length-1);
    var tempName = ('' === name) ? 'You' : name; //set You as their name if not set yet
    say(slowPrompts[i][0]+tempName+slowPrompts[i][1]);
}

function logConversation (callback) {
    //make sure their name has been set
    if ('' === name) {
        return callback("I can't log the conversation if I don't know your name. What is it?");
    }

    var filename = name+'_'+(new Date().getTime())+'.log';
    fs.writeFile(filename, log, function (error) {
        if (error) {
            callback('Error logging conversation: '+error);
        } else {
            callback('Conversation Logged');
        }
    });
}


function checkForFiles(){
	
	//Read in an array of the current filenames in the current directory.
	var newfilenames = fs.readdirSync('.');
	var added = false;
	for (var i = 0; i < newfilenames.length; i++){
		
		//If the current file is a json file...
		if(newfilenames[i].slice(-5) == '.json'){
			var newfile = true;
			var thisfile = newfilenames[i];
			for(var j = 0; j < dictlist.length; j++){
				//Check to see if it's currently in the list of dictionaries.
				if(dictlist[j] == thisfile){
					var newfile = false;
				}
			}
			//If not, add it to the list and concat the contents into the working dictionary.
			if(newfile){
				console.log("Adding the file!");
				dictlist.push(thisfile);
				var newdict = JSON.parse(fs.readFileSync(thisfile, 'utf8'));
				elizadict = elizadict.concat(newdict);
				var added = true;
			}
		}
		
	}
	if(added){
		say("I just got smarter!");
		return;
	}
	else{
		return;
	}
}

//////////////////////////////////////////////////////////////////////
/// Helper functions
//////////////////////////////////////////////////////////////////////

function setCoffeeInterval () {
    coffeeTime = setInterval(coffeeInterval, 180000); //3 minutes
}

function setQuestionInterval () {
    questionTime = setInterval(questionInterval, 20000); //20 seconds
}

function say (message) {
    log += 'Eliza: '+message+'\nYou: ';
    process.stdout.write('Eliza: '+message+'\nYou: ');
    if((message.slice(-1)) == '?'){
    	setQuestionInterval();
    }
}

function rand (min, max) {
    return Math.floor(Math.random()*(max-min)+min);
}