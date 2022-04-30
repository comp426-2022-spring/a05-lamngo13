//minimist stuff
const args = require('minimist')(process.argv.slice(2));

const help = (`
server.js [options]
--port, -p	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug, -d If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help, -h	Return this message and exit.
`)
// If --help, echo help text and exit
if (args.help || args.h) {
    console.log(help);
    process.exit(0);
}
var express = require('express');
var app = express();
const fs = require('fs');
const morgan = require('morgan');
const logdb = require('./src/services/database.js');

//Allow json body messages
app.use(express.json());

const port = args.port || args.p || process.env.PORT || 5000
if (args.log == 'false') {
  console.log("NOTICE: not creating file access.log")
  //false is string not boolean tbh
} else {
    const logdir = './log/';
    if (!fs.existsSync(logdir)) {
      fs.mkdirSync(logdir);
    }

    //writestream
    const accessLog = fs.createWriteStream( logdir+'access.log', {flags: 'a'})
    //morgan for middleware
    app.use(morgan('combined'), {stream: accessLog});

}
//end else statement

app.use((req, res, next) => {
  let logdata = {
      remoteaddr: req.ip,
      remoteuser: req.user,
      time: Date.now(),
      method: req.method,
      url: req.url,
      protocol: req.protocol,
      httpversion: req.httpVersion,
      status: res.statusCode,
      referrer: req.headers['referer'],
      useragent: req.headers['user-agent']
  };
  const stmt = logdb.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referrer, logdata.useragent)
  //console.log(info)
  next();
})

//BEGIN COIN FUNCTIONS
function coinFlip() {
  let num = Math.floor(Math.random() * 10);
  if (num % 2 == 0) {
    return "heads";
  } else {
    return "tails";
  }
  }
  
  
  
  
  /** Multiple coin flips
   * 
   * Write a function that accepts one parameter (number of flips) and returns an array of 
   * resulting "heads" or "tails".
   * 
   * @param {number} flips 
   * @returns {string[]} results
   * 
   * example: coinFlips(10)
   * returns:
   *  [
        'heads', 'heads',
        'heads', 'tails',
        'heads', 'tails',
        'tails', 'heads',
        'tails', 'heads'
      ]
   */
  
  function coinFlips(flips) {
    let theResult = ""
    let bruh = [];
    for (let i = 0; i < flips; i++) {
      //bruh[i] = coinFlip();
      theResult = coinFlip()
      bruh.push(theResult)
    }
  return bruh;
  }
  
  /** Count multiple flips
   * 
   * Write a function that accepts an array consisting of "heads" or "tails" 
   * (e.g. the results of your `coinFlips()` function) and counts each, returning 
   * an object containing the number of each.
   * 
   * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
   * { tails: 5, heads: 5 }
   * 
   * @param {string[]} array 
   * @returns {{ heads: number, tails: number }}
   */
  
  function countFlips(array) {
    let nHeads = 0;
    let nTails = 0;
    if (array.length == 0) {
      return "the array is empty.";
    }
  
    var returnable = {
      heads: 0,
      tails: 0
    }
    //end edge case 
  
    array.forEach(flip => {
      if (flip == "heads") {
        returnable.heads++
      } else {
        returnable.tails++
      }
    })
    return returnable
  
  
    //if (nHeads == 0) {
    //  return "{ tails: " + nTails.toString() + " }";
    //}
    //else if (nTails == 0){
    //  return "{ heads: " + nHeads.toString() + " }";
    //}
    //else {
    //  //return "{ heads: " + nHeads + " tails: " + nTails + " }"
    //  return "{heads: " + nHeads + " tails: " + nTails + "}"
    //  
    //}
  
    //return array;
  }
  
  /** Flip a coin!
   * 
   * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
   * 
   * @param {string} call 
   * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
   * 
   * example: flipACoin('tails')
   * returns: { call: 'tails', flip: 'heads', result: 'lose' }
   */
  
  function flipACoin(call) {
      let flip = coinFlip()
      const obj = { call: call, flip: flip, result: 'lose' }
      if (call == flip) {
          obj.result = 'win';
      }
      return obj;
    //let result = coinFlip();
    //let winner = ""
    //if (call == result) {
    //  winner = "win"
    //} else {
    //  winner = "lose"
   // }
  //  return "{call:" + call +",flip:" + result + ",result:" + winner +"}"
  }
//END COIN FUNCTIONS