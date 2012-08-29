chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
	switch(request.method){
		case 'getConf':
			var conf;
			try{
				conf = JSON.parse(localStorage["configuration"]);
			}catch(e){
				conf = undefined;
			}
			sendResponse({data: conf});
			break;
		case 'setConf':
			localStorage.setItem("configuration",JSON.stringify(request.data));
			break;
		case 'xhr':
			var xhr = new XMLHttpRequest();
			xhreq = request.request;
			console.log(xhreq);
			xhr.onreadystatechange = function(){if(xhr.readyState === 4){sendResponse({data:{responseText: xhr.responseText}})}};
			xhr.open("GET", xhreq.url, true);
			xhr.send();
			return true;
			break;
	}
	return false;
});