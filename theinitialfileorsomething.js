var express = require('express');
var request = require('request');
var app = express();
var fs = require('fs');
var config = {};
var server;

function startServer(){
	app.get('/', function (req, res) {
	  res.send('Hello World!');
	});

	var server = app.listen(3000, function () {

	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Example app listening at http://%s:%s', host, port);

	});
}

function checkServer(datum){
	return request(datum.url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      datum.status = "OK";
	      datum.timeStamp = new Date();
	    } else {
	      datum.status = "Alert";
	      datum.timeStamp = new Date();
	    }
	    console.log(datum);
	    return datum;
	});
		
}

function checkDaemon(datum){
	console.log("d - datum", datum);
	return datum;
}
function checkServices(){
	config.map(function(datum){
		if(datum.type === "web"){
			return checkServer(datum)
		}
		else{
			return checkDaemon(datum);
		}
	});
}

fs.readFile('./config', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  dataSet = JSON.parse(data);
  console.log("data?", config);
  dataSet.map(function(datum){
  	datum.status = "??";
  	datum.timeStamp = new Date();
  	// console.log(datum);
  	return datum;
  })
  config = dataSet;
  checkServices();
  //startServer();
});





