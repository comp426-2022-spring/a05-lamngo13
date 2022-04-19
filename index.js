//import { coinFlip, coinFlips, countFlips, flipACoin} from './modules/coin.mjs'
//import { createRequire } from 'module'
//import { isArgumentsObject } from 'util/types'

//let {coinFlip, coinFlips, countFlips, flipACoin} = await import('./modules/coin.mjs');
//let {coinFlip, coinFlips, countFlips, flipACoin} = await import('./modules/coin.mjs');
//const require = createRequire(import.meta.url)
//MAYBE DONT DO THIS ^^^

const express = require('express')
const app = express()
const db = require("./src/services/database.js")
const morgan = require('morgan')
const fs = require('fs')
//import stuff as module?????
const coinfs = require('./modules/coin.mjs')
//make require bettersqulite3?

//COIN FUNCTION DEFS
function coinFlip() {
    let num = Math.floor(Math.random() * 10);
    if (num % 2 == 0) {
      return "heads";
    } else {
      return "tails";
    }
}

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
}
function flipACoin(call) {
    let flip = coinFlip()
    const obj = { call: call, flip: flip, result: 'lose' }
    if (call == flip) {
        obj.result = 'win';
    }
    return obj;
}
//rip importing tbh


// Make Express use its own built-in body parser for both urlencoded and JSON body data.
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//*** */

// Serve static HTML files
app.use(express.static('./public'));

const argument = require('minimist')(process.argv.slice(2))
//argument['port']
const port = argument.port || process.env.PORT || 5555

//help stuff
const help = (`
server.js [options]
  --por		Set the port number for the server to listen on. Must be an integer
              	between 1 and 65535.
  --debug	If set to true, creates endlpoints /app/log/access/ which returns
              	a JSON access log from the database and /app/error which throws 
              	an error with the message "Error test successful." Defaults to 
		false.
  --log		If set to false, no log files are written. Defaults to true.
		Logs are always written to database.
  --help	Return this message and exit.
`);
// If --help or -h, echo help text to STDOUT and exit
if (argument.help || argument.h) {
    console.log(help)
    process.exit(0)
}

//start an app server
const server = app.listen(port, () => { 
    console.log('App listening on port %PORT%'.replace('%PORT%',port)) 
});

//APP POST
app.post('/app/flip/coins/', (req, res, next) => {
    const flips = coinFlips(req.body.number)
    const count = countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
})

app.post('/app/flip/call/', (req, res, next) => {
    const game = flipACoin(req.body.guess)
    res.status(200).json(game)
})

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
      referer: req.headers['referer'],
      useragent: req.headers['user-agent']
    }

    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)
    
    next();
})

if (argument.debug) {
    app.get('/app/log/access', (req, res) => {
        const stmt = db.prepare('SELECT * FROM accesslog').all()
        res.status(200).json(stmt)
        //try {
          //  const stmt = db.prepare('SELECT * FROM accesslog').all()
          //  res.status(200).json(stmt)
        //} catch {
         //   console.error(e)
       // }
    });
    
    app.get('/app/error', (req, res) => {
        throw new Error('Error test successful')
    }); 
}

//log stuff
/*
if (argument.log == true) {
    //LOWKEY SHOULD TRUE BE A STRING THO
    const zlog = fs.createWriteStream('access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: zlog }))
} else {
    app.use(morgan('combined'))
}
*/
//REDOING THIS BC IDK MAN
//isn't it a string?????
if (argument.log != 'false') {
    const WRITESTREAM = fs.createWriteStream('./access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: WRITESTREAM }))
  }

//fields


app.get('/app', (req, res) => { //CHECKPOINTT
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead(res.statusCode, { 'Content-Type' : 'text/plain' });
        res.status(res.statusCode).end(res.statusCode + ' ' + res.statusMessage)
        //res.end(res.statusCode+ ' ' +res.statusMessage)
    });

//more log stuff ERROR HANDLING
//added clause abt debugging

/*
app.get('/app/log/access', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM accesslog').all()
        res.status(200).json(stmt)
    } catch {
        console.error(e)
    }
});

app.get('/app/error', (req, res) => {
    throw new Error('Error test successful')
}); 
*/



/*
//RANDOM COIN FLIP ENDPOINT /app/flip/
app.get('/app/flip/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    res.statusMessage = 'OK';
    let outcome = coinFlip();

    //sending the data
    if (outcome == "heads") {
        res.json({"flip":"heads"});
    } else {
        res.json({"flip":"tails"});
    }
    //res.json(coinFlip())
});
    
//MANY FLIPS
app.get('/app/flips/:number', (req, res) => {
	// Respond with status 200
    res.statusCode = 200;
    res.statusMessage = 'OK';
    let theNum = req.params.number;
    let zraw = coinFlips(theNum);
    //use the outcomes - only run coinFlips ONCE
    let zsummary = countFlips(zraw)

    //send the data
    res.json({"raw":zraw, "summary":zsummary})

});

//guess heads
app.get('/app/flip/call/heads', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    res.statusMessage = 'OK';
    let abstraction = flipACoin('heads')
    res.json(abstraction);
    //res.json(flipACoin("heads"))
});

//guess tails
app.get('/app/flip/call/tails', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    res.statusMessage = 'OK';
    let abstraction = flipACoin('tails');
    res.json(abstraction);
    //res.json(flipACoin("tails"))
});
*/

// Default response for any other request
app.use(function(req, res){
    res.type('text/plain')
    res.status(404).send('404 NOT FOUND')
});

//END STUFF MAYBE PUTIN ANOTHER PLACE
// Check status code endpoint
//app.get('/app/', (req, res) => {
  //  res.statusCode = 200;
   // res.statusMessage = 'OK';
   // res.writeHead(res.statusCode, { 'Content-Type' : 'text/plain'});
   // res.end(res.statusCode+ ' ' +res.statusMessage) });

// If not recognized request (other requests)
//app.use(function(req, res){
  //  res.status(404).send('404 NOT FOUND')
//});