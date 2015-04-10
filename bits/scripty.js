console.log("loaded!");

function checkStatus(){
	var req = new XMLHttpRequest();
	req.open("GET","/status");
	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304) {
			console.log("request error - ", req.status)
			return;
		}
		loadStatus(JSON.parse(req.response));
	}
	req.send();
}

function loadStatus(status){
	console.log($, status);
	var UL = $("#Stati");
	console.log(UL);
	UL.empty();
	UL.append("<li><p>NAME -</p><p>STATUS -</p><p>Last Seen -</p></li>");
	status.payload.forEach(function(stat){
		UL.append("<li><p>"+stat.name+"</p><p>"+stat.status+"</p><p>"+stat.last_seen+"</p></li>");
	})
	setTimeout(checkStatus, 5000);
}

checkStatus();