chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
	switch(request.method){
		case 'badgeText':
			chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT, active: true}, function(tabs){
				chrome.browserAction.setBadgeText({text: (request.data+""), tabId: tabs[0].id});
			})
			break;
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
			xhr.onreadystatechange = function(){if(xhr.readyState === 4){console.log("Got " + xhreq.url);sendResponse({data:{responseText: xhr.responseText}})}};
			xhr.open(xhreq.method, xhreq.url, true);
			if(xhreq.method == "POST"){
				xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			}
			xhr.send(xhreq.data);
			return true;
			break;
	}
	return false;
});