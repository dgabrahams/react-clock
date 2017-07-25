'use strict';

const express = require('express');
const app = express();
// var Sntp = require('sntp');
//var url = require("url");
// var MongoClient = require('mongodb').MongoClient, assert = require('assert');
// const eventEmitter = require('events');
//var exec = require('child_process').exec;
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

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}



var getJSON = function(db, collectionName, res, req, callback) {
   console.log('in function');
   // var cursor =db.collection('test1').find();
   var cursor =db.collection(collectionName).find();
   var results = {};//works as a string and then to add JSON.stringify(doc)
   var count = -1;
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      // console.log(count);
      if (doc != null) {
		count++;
        results[count] = doc;
        // console.log(typeof doc);
      } else {
      	// console.log('in function callback');
        callback(results);
      }
   });
};

//runs terminal command.
function consoleCallback(error, stdout, stderr) {
	// sys.consoleCallback(stdout)
	// console.log('stdout:');
	console.log(stdout);
	// var textReturn = stdout;
	// return stdout;//for some reaons this outputs a whole object//its a callback function!!!!!
	// return textReturn;
}


app.all('*', function (req, res, next) {
	
	if ( req.params[0] != '/favicon.ico' ){

		console.log(req.params);
		console.log('In request for *');
		// Website you wish to allow to connect
		//res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', true);

		next() // pass control to the next handler

	} else {
		res.status(404);
		res.end();
	}

	// if ( req.params[0].startsWith('/favicon.ico') ){

	// } else {
	// 	next() // pass control to the next handler
	// }

});

app.get('/js*', function (req, res) {
  // res.send('Birds home page');
  console.log('In get: /js*');

	// switch(req.params[0]) {

	// }

	// var fileName = './js'+req.params[0];//becuase of the get, params os now shorter!
	// console.log(fileName);

    fs.readFile('./js'+req.params[0],function (err, data){
        // res.writeHead(200, {'Content-Type': 'text/javascript','Content-Length':data.length});
        res.status(200);
        res.setHeader('Content-Type', 'text/javascript');
        res.setHeader('Content-Length', data.length);
        res.write(data);
        res.end();
    });

  // res.end();//THIS WAS CAUSING THE ERROR!!!
});

app.get('/css*', function (req, res) {

	console.log('In get: /css*');

    fs.readFile('./css'+req.params[0],function (err, data){
        // res.writeHead(200, {'Content-Type': 'text/javascript','Content-Length':data.length});
        res.status(200);
        res.setHeader('Content-Type', 'text/css');
        res.setHeader('Content-Length', data.length);
        res.write(data);
        res.end();
    });

});

app.get('/images*', function (req, res) {

    fs.readFile('./images'+req.params[0],function (err, data){
        res.status(200);
        res.setHeader('Content-Type', 'image/jpeg');
        res.end(data, 'binary');
    });

});


// app.get('/themes*', function (req, res) {
//   // res.send('Birds home page');
//   console.log('In get: /themes*');

// 	// switch(req.params[0]) {

// 	// }

// 	// var fileName = './js'+req.params[0];//becuase of the get, params os now shorter!
// 	// console.log(fileName);

//     fs.readFile('./js'+req.params[0],function (err, data){
//         // res.writeHead(200, {'Content-Type': 'text/javascript','Content-Length':data.length});
//         res.status(200);
//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Content-Length', data.length);
//         res.write( JSON.stringify(data) );
//         res.end();
//     });

//   // res.end();//THIS WAS CAUSING THE ERROR!!!
// });


app.get('/time*', function (req, res) {
	// res.send('Birds home page');
	console.log('In get: /thyme*');

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
		console.log('req ip: '+req.connection.remoteAddress);

		// var runTerminal_location = execSync("curl freegeoip.net/json/86.178.93.181");//WORKS! - ip for maida vale
		var runTerminal_location = execSync("curl freegeoip.net/json/86.178.93.181");//WORKS! - ip for maida vale
		console.log(runTerminal_location.toString('ascii'));

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

});




// app.route('/*').all(function(req,res,next) {

// app.route('/*').all(function(req,res,next) {
// app.route('/*').all(function(req,res,next) {
app.get('/*', function (req, res) {
// app.get('/js*', function (req, res) {

	console.log('In router: /*');
	// // Website you wish to allow to connect
	// res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

	// // Request methods you wish to allow
	// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// // Request headers you wish to allow
	// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// // Set to true if you need the website to include cookies in the requests sent
	// // to the API (e.g. in case you use sessions)
	// res.setHeader('Access-Control-Allow-Credentials', true);

    // console.log('req.connection.remoteAddress: ' + req.connection.remoteAddress);//works - returns ip address of visitor
    // app.use( "/js*" , jsRequest(req, res, next) );
// console.log(req.params);
	// switch(req.params[0].startsWith('/js')) {

	// }
	// if( req.params[0].startsWith('/js') ){
	// 	console.log('this is a js file from if');
	// 	// res.write('data');
	// 	// res.end();	
	// 	next();
	// } else if ( req.params[0].startsWith('/css') ){

	// }

//still does the stuff below it!

    // htmlBody = '';//makes it fresh for each load
	// var dBurl = 'mongodb://localhost:27017/test-db-themes';

	switch(req.url) {
	    case '/site':
		    fs.readFile('react-clock.html',function (err, data){
		        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
		        res.write(data);
		        res.end();
		    });
	        break;
	    case '/themes':
	   //      MongoClient.connect(dBurl, function(err, db) {
	   //          assert.equal(null, err);
	   //          console.log("Connected successfully to server");
				// MongoClient.localResult = db.databaseName;
				// console.log('MongoClient.localResult: '+MongoClient.localResult);//works!!!!! 
				// getJSON(db, 'testThemes', res, req, function(data) {
				// 	res.write( JSON.stringify(data) );
				// 	res.end();
				// 	db.close();
				// });
	   //      });
				fs.readFile('./js'+req.params[0],function (err, data){
				    // res.writeHead(200, {'Content-Type': 'text/javascript','Content-Length':data.length});
				    var obj = JSON.parse(data);
				    res.status(200);
				    res.setHeader('Content-Type', 'application/json');
				    //res.setHeader('Content-Length', data.length);
				    //res.write( JSON.stringify(data) );
				    res.write( obj );
				    res.end();
				});
	        break;
	    default:
	        res.write('<div>Welcome.</div>');
	        res.end();
	}

});

function jsRequest(req, res, next){
	console.log('jsRequest');
}


// app.get('/test', (req, res) => {
// 	console.log('from new server');

// 	// Website you wish to allow to connect
// 	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

// 	// Request methods you wish to allow
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// 	// Request headers you wish to allow
// 	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

// 	// Set to true if you need the website to include cookies in the requests sent
// 	// to the API (e.g. in case you use sessions)
// 	res.setHeader('Access-Control-Allow-Credentials', true);

// 	res.write('<div>from new server</div>');//FF gives an XML parsing error if there are no tags in the text.
// 	res.end();
// });


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  var reply = '500 Internal Error...thing...';

  //doesn't work, of course!
  // setTimeout(function(res,reply){  
		// res.status(500).send(reply);
  // }, 4000);
  res.status(500).send(reply);
});

// app.listen(8080, function() {
//   console.log('Server running at http://127.0.0.1:8080/');
// });
