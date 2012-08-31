function doMessage(evt){
	var message = evt.target.id;
	chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT, active: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id,{method:message});
	})
}
document.getElementById("clearCssCache").addEventListener("click", doMessage);