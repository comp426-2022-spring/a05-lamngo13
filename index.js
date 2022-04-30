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
//END COIN FUNCTIONS

app.use(express.static('./public'))

app.get("/app/", (req, res, next) => {
  res.json({"message":"Your API works! (200)"});
res.status(200);
});

app.get('/app/flip/', (req, res) => {
  const flip = coinFlip()
  res.status(200).json({ "flip" : flip })
});

app.post('/app/flip/coins/', (req, res, next) => {
  const flips = coinFlips(req.body.number)
  const count = countFlips(flips)
  res.status(200).json({"raw":flips,"summary":count})
})

app.get('/app/flips/:number', (req, res, next) => {
  const flips = coinFlips(req.params.number)
  const count = countFlips(flips)
  res.status(200).json({"raw":flips,"summary":count})
});

app.post('/app/flip/call/', (req, res, next) => {
  const game = flipACoin(req.body.guess)
  res.status(200).json(game)
})

app.get('/app/flip/call/:guess(heads|tails)/', (req, res, next) => {
  const game = flipACoin(req.params.guess)
  res.status(200).json(game)
})

if (args.debug || args.d) {
  app.get('/app/log/access/', (req, res, next) => {
      const stmt = logdb.prepare("SELECT * FROM accesslog").all();
    res.status(200).json(stmt);
  })

  app.get('/app/error/', (req, res, next) => {
      throw new Error('Error test works.')
  })
}

//rip endpoints tbh
app.use(function(req, res){
  const statusCode = 404
  const statusMessage = 'NOT FOUND'
  res.status(statusCode).end(statusCode+ ' ' +statusMessage)
});

//server start
const server = app.listen(port, () => {
  console.log("Server running on port %PORT%".replace("%PORT%",port))
});

process.on('SIGINT', () => {
  server.close(() => {
  console.log('\nApp stopped.');
  });
});