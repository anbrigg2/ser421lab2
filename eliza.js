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
var startq = [
    'how is your day going?',
    'is something troubling you?',
    'you seem happy, why is that?',
    'what\'s up doc?',
    'hmmm... what should we talk about today?'
];

//initial startup
rl.question('Eliza: What\'s your name?\nYou: ', function (ans) {
    name = ans;
    var i = rand(0, startq.length);
    say('Hello '+ans+', '+startq[i]);
});


//continuous talking
rl.on('line', function (line) {
    getResponse(line, function (ans) {
        say(ans);
    });
});





function getResponse (line, callback) {
    line = line.trim().toLowerCase();
    //if the user wants to quit
    if (line.trim().toLowerCase() === 'quit') {
        rl.close();
        process.exit();
    }

    line = line.replace(/[^a-z ]/g, '');
    var words = line.split(' ');

    callback('The first word you said was '+words[0]);
}


//////////////////////////////////////////////////////////////////////
/// Helper functions
//////////////////////////////////////////////////////////////////////

function say (message) {
    process.stdout.write('Eliza: '+message+'\nYou: ');
}

function rand (min, max) {
    return Math.floor(Math.random()*(max-min)+min);
}