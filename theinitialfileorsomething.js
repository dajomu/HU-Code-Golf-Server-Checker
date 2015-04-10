var express = require('express');
var request = require('request');
var sys = require('sys')
var exec = require('child_process').exec;
var app = express();
var fs = require('fs');
var config = {};
var server;
var timer = 3000;

function startServer(){
	app.get('/', function (req, res) {
	  res.sendFile(__dirname+'/bits/index.html');
	});

	app.get('/:page', function(req, res) {
		var page = req.params.page,
			reqIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		if(page === "status"){
			console.log("request came in!!", reqIP);
			var response = [];
			config.forEach(function(datum){
			  	response.push({name:datum.name, status:datum.status, last_seen:new Date() - datum.timeStamp})
			})
			res.json({payload: response});
		}
		else{
			res.sendFile(__dirname+'/bits/'+page);
		}
	  // res.sendfile(path.join(__dirname, 'public', 'pages', path.basename(req.params.page) + '.html'));
	  console.log("page req - <"+req.params.page+">", "IP:"+reqIP);
	});

	app.get('/status', function (req, res) {
	  
	});

	var server = app.listen(3000, function () {

	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Status app listening at http://%s:%s, check /status for ..... something!', host, port);

	});

	checkServices();
}

function checkServer(datum){
	return request(datum.url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      datum.status = "OK";
	      datum.timeStamp = new Date();
	    } else {
	      datum.status = "Alert";
	    }
	    return datum;
	});
		
}

function checkDaemon(datum){
	exec("curl -XPUT localhost:8888/status -d id="+datum.id, function(error, stdout, stderr){
		if(error){
			datum.status = "ALERT";
		}
		else{
			datum.status = "OK"
			datum.timeStamp = new Date();
		} 
	});
	return datum;
}

function checkServices(){
	console.log("checking services.....");
	config.map(function(datum){
		if(datum.type === "web"){
			return checkServer(datum)
		}
		else{
			return checkDaemon(datum);
		}
	});
	setTimeout(checkServices, timer);
}

fs.readFile('./config', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  dataSet = JSON.parse(data);
  dataSet.map(function(datum){
  	datum.status = "OK";
  	datum.timeStamp = new Date();
  	return datum;
  })
  config = dataSet;
  startServer();
});
