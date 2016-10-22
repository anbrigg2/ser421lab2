/**
 * Ryan Baker
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

var name = '';
var coffeeIntervalFlag = false;
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

//initial startup
say("What's your name?");
setQuestionInterval();

//continuous talking
rl.on('line', function (line) {
    //they responded, clear the question timer
    clearInterval(questionInterval);
    getResponse(line, function (ans) {
        say(ans);
    });
});



function getResponse (line, callback) {
    line = line.trim().toLowerCase();
    //if the user wants to quit
    if (line === 'quit') {
        rl.close();
        process.exit();
    }
    if (coffeeIntervalFlag && line === 'maybe') {
        //the user responded quickly with maybe
        clearInterval(coffeeInterval);
    }
    //set thisflag to false
    coffeeIntervalFlag = false;

    if ('' === line) {
        return callback('Say more than nothing!');
    }

    if ('' === name) {
        name = line;
        var i = rand(0, startQuestions.length-1);
        setQuestionInterval();
        return callback('Hello '+line+', '+startQuestions[i]);
    }

    line = line.replace(/[^a-z ]/g, '');
    var words = line.split(' ');

    return callback('The first word you said was '+words[0]);
}

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


//////////////////////////////////////////////////////////////////////
/// Helper functions
//////////////////////////////////////////////////////////////////////

function setCoffeeInterval () {
    setInterval(coffeeInterval, 180000); //3 minutes
}

function setQuestionInterval () {
    setInterval(questionInterval, 20000); //20 seconds
}

function say (message) {
    process.stdout.write('Eliza: '+message+'\nYou: ');
}

function rand (min, max) {
    return Math.floor(Math.random()*(max-min)+min);
}