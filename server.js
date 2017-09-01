'use strict';

const express = require('express');
const app = express();
var execSync = require('child_process').execSync;
var ntpClient = require('ntp-client');
var http = require('http'),
    fs = require('fs');

//for express 4
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('port', (process.env.PORT || 3001));//Used at bottom to determine the port to run - default to 3001 when local

// Express only serves static assets in production - not needed?
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

var ntpRequestCount = Math.floor(Date.now() / 1000);

app.all('*', function (req, res, next) {
	
	if ( req.params[0] != '/favicon.ico' ){

		// console.log(req.params);
		// console.log('In request for * - setting Headers');
		// Website you wish to allow to connect
		//res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

		// Request methods you wish to allow
		// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Methods', 'GET');

		// Request headers you wish to allow
		// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
		// res.setHeader('Access-Control-Allow-Credentials', true);

		next() // pass control to the next handler

	} else {
		res.status(404);
		res.end();
	}

});

app.get('/js*', function (req, res) {
	// console.log('In get: /js*');

    fs.readFile('./js'+req.params[0],function (err, data){
        res.status(200);
        res.setHeader('Content-Type', 'text/javascript');
        res.setHeader('Content-Length', data.length);
        res.write(data);
        res.end();
    });

});

app.get('/css*', function (req, res) {
	// console.log('In get: /css*');

    fs.readFile('./css'+req.params[0],function (err, data){
        res.status(200);
        res.setHeader('Content-Type', 'text/css');
        res.setHeader('Content-Length', data.length);
        res.write(data);
        res.end();
    });

});

app.get('/images*', function (req, res) {
	// console.log('In get: /images*');

    fs.readFile('./images'+req.params[0],function (err, data){
        res.status(200);
        res.setHeader('Content-Type', 'image/jpeg');
        res.end(data, 'binary');
    });

});


app.get('/themes*', function (req, res) {
	// console.log('In get: /themes*');

	fs.readFile('./js/themes.json',function (err, data){
	    var obj = JSON.parse(data);
	    res.status(200);
	    res.setHeader('Content-Type', 'application/json');
	    res.write( JSON.stringify(obj) );
	    res.end();
	});

});

app.get('/timezones*', function (req, res) {
	// console.log('In get: /timezones*');

	fs.readFile('./js/timezones.json',function (err, data){
	    var obj = JSON.parse(data);
	    res.status(200);
	    res.setHeader('Content-Type', 'application/json');
	    res.write( JSON.stringify(obj) );
	    res.end();
	});

});


app.get('/time*', function (req, res) {
	// console.log('In get: /time*');
	var currentDate = Math.floor(Date.now() / 1000);//retruns seconds since epoch.

	//server either says yes or no then ends the request, the client gets a no and then waits to send a new one. the waiting and resent is all managed client side.
	//specification is that 2 requests from the same source cannot happen within a 4 second time frame, so the service will only answer one request every 4 seconds.
	//otherwise, the requester will be blocked (or blacklisted).
	if ( parseInt(currentDate) - parseInt(ntpRequestCount) > 5 ) {
		console.log('can send request');
		console.log('currentDate: '+currentDate);
		console.log('ntpRequestCount: '+ntpRequestCount);
		ntpRequestCount = currentDate;

		var d = new Date();

		ntpClient.getNetworkTime("pool.ntp.org", 123, function(err, date) {
		    if(err) {
		        console.error(err);
		        return;
		    }
		 
		    console.log("Current time : " +date);// Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été)) 
			// res.write( JSON.stringify(date) );//2017-07-25T19:45:38.512Z - can be put into a new Date() object passed as a string to get: Tue Jul 25 2017 19:56:25 GMT+0000 (UTC)
			// // res.write( date.toString() );//outputs Tue Jul 25 2017 19:56:25 GMT+0000 (UTC)

			var e = new Date();

			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
	        console.log('req ip: '+ip);
	        var runTerminal_location = execSync("curl freegeoip.net/json/"+ip);//need to make sure it is ipv4 only!
	        console.log(runTerminal_location.toString('ascii'));
	        //IP will default to the cetner of a country if it is not tied to a physical address: http://splinternews.com/how-an-internet-mapping-glitch-turned-a-random-kansas-f-1793856052
	        //Also, if there is only one router in a large area, it will default to that router for exmaple.
	        //Client side Location API is more accurate (best on mobile devices with GPS), and with wifi on can be very accurate (if not moving)
	        //freegeoip should give the country with around 95%-99% accuracy, the city with 50%-80% accuracy. http://whatismyipaddress.com/geolocation-accuracy

			var locationData = JSON.parse( runTerminal_location.toString('ascii') );
			console.log( locationData );

			//will utc date get issues when it is close to a change over...if used on local time the time is different, a straight off new Date() object gets the right time, new Date().getUTCHours() is wrong when local machine is in british summer time.
			var resObj = {
				'T3' : Math.round(+new Date()/1000),
				'T2' : Math.round(d/1000),
				'ntp': JSON.stringify(date).toString('ascii'),
				'date': ( parseInt(d.getUTCMonth())+1 )+'/'+d.getUTCDate()+'/'+d.getUTCFullYear(),
				'timeZone' : JSON.stringify(locationData)
			}

			res.write( JSON.stringify(resObj) );
			res.end();

		});

	} else {
		//settimeout loop runs on the client.
		console.log('CANNOT send request');
		console.log('currentDate: '+currentDate);
		console.log('ntpRequestCount: '+ntpRequestCount);
		res.write('Unable to complete NTP request.');
		res.end();
	}//end else

});

app.get('/*', function (req, res) {
	// console.log('In get: /*');

	switch(req.url) {
	    case '/site':
		    fs.readFile('react-clock.html',function (err, data){
		        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
		        res.write(data);
		        res.end();
		    });
	        break;
	    case '/sitegeo':
		    fs.readFile('./html/geotest.html',function (err, data){
		        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
		        res.write(data);
		        res.end();
		    });
	        break;
	    default:
	        res.write('<div>Welcome.</div>');
	        res.end();
	}

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

//Error reporting
app.use(function(err, req, res, next) {
  console.error(err.stack);
  var reply = '500 Internal Error...thing...';
  console.log(typeof err.stack);
  res.status(500).send(reply);
});
