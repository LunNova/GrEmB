chrome.extension.onRequest.addListener(function(request,sender,sendResponse){
	switch(request.method){
		'getConf': 
			var conf = localStorage["configuration"];
			sendResponse({data: conf)}
			break;
		'setConf':
			localStorage.setItem("configuration",JSON.stringify(request.data));
			break;
	}
});