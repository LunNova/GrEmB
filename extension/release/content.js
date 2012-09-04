// ==UserScript==
// @name		GrEmB - Global r/mylittlepony Emote Bundle
// @version		1.98090
// @namespace		http://nallar.me
// @run-at		document-start
// @description		Reddit emote display script.
// @license		SpoutDev License - https://raw.github.com/SpoutDev/Spout/2f8cc539abaef/LICENSE.txt - Code marked as ArbitraryEntity's is exluded from this, you must get permission from AE to include it in a fork/modification/etc.
// @author		nallar,ArbitraryEntity
// @credits		Super Reddit Alt-Text display by ArbritaryEntity is included in this script. Emote Manager was inspired by RogueDarkJedi's Easy Emotes and My Global Ponies,duh! Color scheme used for user familiarity reasons, you can set your own in the config.)
// @homepage	http://nallar.me/scripts
// @include		http://*/*
// @include		https://*/*
// @exclude		http://www.redditmedia.com/*
// @exclude		http://pagead2.googlesyndication.com/*
// @exclude		http://*google.com/reviews/widgets*
// @exclude		http://www.blogger.com/navbar.*
// @exclude		http://googleads.g.doubleclick.net/*
// @exclude		http://badge.stumbleupon.com/*
// @exclude		http://*facebook.com/extern/*
// @exclude		http://*connect.facebook.com/*
// @exclude		http://nwidget.networkedblogs.com/*
// @exclude		http://*.ak.fbcdn.net/connect/*
// @exclude		https://*.ak.fbcdn.net/connect/*
// @exclude		http://*.ak.facebook.com/connect/*
// @exclude		https://*.ak.facebook.com/connect/*
// @exclude		http://*.facebook.com/ai.php?*
// @exclude		https://*.facebook.com/ai.php?*
// @exclude		http://*facebook.com/dialog/oauth*
// @exclude		http://showadsak.pubmatic.com/*
// @exclude		https://www.google.com/blank.html
// @exclude		https://plus.google.com/u/0/_/notifications/frame*
// @exclude		http://*.doubleclick.net/*
// @exclude		http://tracking.*
// @exclude		http://www.youtube.com/embed/*
// @exclude		http://cdn.turn.com/*
// @exclude		http://assets.tumblr.com/iframe.html*
// @exclude		http://w.visualdna.com/analytics/*
// @exclude		http://*ads*.*.*
// @exclude		http://www.meebo.com/cim/sandbox.php?*
// @updateURL	%^UURL^%
// @iconURL		http://nallar.me/scripts/logo.png
// ==/UserScript==

var localVersion = 1.98090;

//If there's another(reasonable :P) license you think this should be released under, just ask!

//Report bugs at the 'Send me a message!' link at the homepage.
if(document.mozSyntheticDocument){
	return;
}

var doNotUse = '', ranPassFunction = false, mainStylesheet = "http://nallar.me/css/css.php?key=", confStore = undefined, inFrame = (window.top != window);
var wkMutation = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
if(location.protocol === "https:"){
	mainStylesheet = "https://nallar.me/css/css.php?key=";
}

if(inFrame&&(window.innerWidth < 200 ||  window.innerHeight < 200)){
	ranPassFunction = true;
}

if(!console || !console.log){
	console = {log: function(s){}};
}

function passFunction(){
		if(ranPassFunction||document.getElementById("noGlobalPonymotes")){
			return (ranPassFunction = true&&false);
		}
		ranPassFunction = true;
		
		
		
		//START STATIC VARS
		var debug, sSection, sSSection, endSection, endSSection, unsupported = false, madeConf = false, isWebKit = navigator.userAgent.indexOf('WebKit/') != -1, isChrome = navigator.userAgent.indexOf('Chrome/') != -1, isFF = navigator.userAgent.indexOf('Firefox/') != -1, globalConvert = !isReddit, markdownConvert = isReddit, cssPrefix = (isWebKit?'-webkit-':(window.opera?'-o-':'-moz-')), superBundlePrefs,cssStore='',currentForm = false, cssElement = false, windowClasses = "GrEmBWindow GrEmBEmoteWindow", closedWindowClasses = windowClasses + " closedWindow", setUpTabs = false, windowCreators = {},isReddit = (/reddit\.com/i).test(window.location.host)||document.getElementById("redditPonymotes"), timeOutCounter = 60, initRefresh = false, doRefresh = false, requiredStyles = 1, loadedStyles = 0, doSave = 0, noGlobalTags = {"TEXTAREA":true, "INPUT":true, "CODE":true, "SCRIPT":true}, emoteMatchRegExp = /(?:^|[^\\])\[\]\(\/([_!a-zA-Z0-9\-]{1,60})(?:\s"([^"]+?)"|\s'([^']+)')?\)/, goEmote = true, goExpand = true, stopExp = false, goFind = true, ranInitial = false, wt = 0, cssRun = true, linkRegex = /\b(?:(http(?:s?)\:\/\/)|(?:www\d{0,3}[.])|(?:[a-z0-9.\-]+[.][a-z]{2,4}\/))(?:\S*)\b/i, noExpandEmotes = {'/b':1, '/s':1, '/spoiler':1,}, settingsForm = false, noCloneNames = {'emoteNames':1}, oldDis = false, convTimeout = false, tabs = {};
		
		var flagFunctions = {
			'rs_': function(flag,em){
				em.style[cssPrefix+'transform']+=' scaleX('+flag+') scaleY('+flag+')';
			},
			
			'rsx_': function(flag,em){
			
			},
			
			'rsy_': function(flag,em){
			
			},
			
			'or_': function(flag,em){
			
			},
		};
		
		var defaultConfs = {
			'defaultEmoteContainer': true,
			'defaultEmoteContainerSearch': true,
			'defaultEmoteContainerMLAS1': true,
			'defaultEmoteContainerILTBAT': true,
			'defaultEmoteContainerMouseLeave': false,
			'defaultEmoteContainerEverywhere': true,
			'defaultEmoteContainerOnTop': true,
			'internalUpdateCheck': true,
			'emoteManagerEverywhere': true,
			'emoteManagerWindowStyleType': true,
			'emoteManagerWindowStyle': 'border: 1px solid #E1B000; background-color: #FFFDCC;',
			'defaultEmoteContainerY': "19",
			'defaultEmoteContainerX': "10",
			'defaultEmoteContainerWidth': "300",
			'defaultEmoteContainerHeight': "375",
			'defaultEmoteContainerSide': false,
			'defaultEmoteContainerGlobal': true,
			'emoteSearchReg': false,
			'disableEmoteSpin': true,
			'nsfwDefunctEmotes': false,
			'alwaysTrue': true,
			'emoteNames': {},
			'updateCheckWeekly': !isFF,
			'lastVersion': 0.01,
			'shouldReset': false,
			'lastUpdate': 0,
			'wideReddit': false,
			'smallToggler': true,
			'emoteCopy': false,
			'revealAltText': true,
			'emoteGroups': {mlp_nsfw: {name: "MLP NSFW", enabled: 0, subs: ["mylittlechaos", "mylittlebannertest", "futemotes", "ponyanarchism", "spaceclop", "clopclop", "nsfwgremotes", "mylittlecombiners", "mylittlepony"], nsfw: 1}, mlp: {name: "MLP", enabled: 1, subs: ["map.css", "mylittletacos", "tacoshy", "mylittlesh", "mlas1party", "mylittleanhero23", "cuttershy", "gremotes", "pankakke", "mylittlesports", "molestia", "flitter", "ilovedashie", "applebloom", "seriouslyluna", "mylittlefoodmanes", "gallopfrey", "mylittleanime", "mylittleaprilfools", "dashiemotes", "lyra", "tbpimagedump", "mylittlealcoholic", "mlplounge", "mylittleserver", "minuette", "twilightsparkle", "mylittlewarhammer", "ainbowdash", "mylittledamon", "mylittlekindle", "octavia", "pinkiepie", "mylittlewtf", "mylittlenanners", "mylittlewelcomewagon", "mylittlenosleep", "mlpdrawingschool", "mylittledaww", "mylittlemusician", "surprise", "mylittlelistentothis", "applejack", "mylittlecelestias", "mylittlefortress", "roseluck", "mlhfis", "falloutequestria", "mylittlelivestream", "mlas1animotes", "daylightemotes", "mylittlesquidward", "vinylscratch", "mylittlenopenopenope", "thebestpony", "mylittleandysonic1", "mlas1emotes", "mlas1imagedump", "idliketobeatree", "mylittlebannertest", "mylittlechaos", "mylittlesupportgroup", "speedingturtle", "mylittlecirclejerk", "mylittleonions", "mylittlecombiners", "mylittlepony"], nsfw: 0}, minecraft: {name: "minecraft", enabled: 1, subs: ["minecraft"], nsfw: 0}, homestuck: {name: "Homestuck", enabled: 1, subs: ["homestuck"], nsfw: 0}, f7u12: {name: "f7u12", enabled: 1, subs: ["fffffffuuuuuuuuuuuu"], nsfw: 0},},
			'emoteGroupsOrder': ['mlp_nsfw', 'mlp', 'minecraft', 'homestuck', 'f7u12'],
			'lastDefaultEmoteGroups': false,
			'nextCacheUpdateTime': 1,
			'cssKey': " ",
			'emoteBlacklist': [],
		};
		//END STATIC VARS
		
		////////////////////////////START FUNCTIONS////////////////////////////
		
		function GM_xmlhttpRequest(request){
			var onComplete = request.onload;
			delete(request.onload);
			chrome.extension.sendMessage({method: "xhr", request: request},function(response){onComplete(response.data)});
		}
		
		function trim(str){
			return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		};
		
		
		if(confStore == undefined || !confStore['alwaysTrue']){
			confStore = defaultConfs;
		}
		
		function G_safeGetValue(){
			return confStore;
		};
		function getConf(id){//preprocessor macro used instead.
			if(defaultConfs[id] === undefined) {
				debug(103, "confStore[): Hmm... this id isn't in defaultConfs, something is wrong :( " + id);
			}
			var temp;
			temp = G_safeGetValue();
			if(temp[id] === undefined) {
				setConf(id, defaultConfs[id]);
				temp[id] = defaultConfs[id];
			}
			return temp[id];
		};
		
		function getConfForm(id){
			if(confStore[id]!==false){
				return "checked='yes'";
			}
			return "";
		}
		
		function getConfForm2(id){
			if(confStore[id]===false){
				return "checked='yes'";
			}
			return "";
		}
		function cloness(thiss){
			var newObj = (thiss instanceof Array) ? [] : {};
			for(i in thiss) {
				if(typeof thiss[i] === "object") {
					newObj[i] = cloness(thiss[i]);
				} else {
					newObj[i] = thiss[i];
				}
			}
			return newObj;
		}
		function setConf(name, value, nosave){
			confStore[name] = value;
			if(!nosave){
				saveConf();
			}
		};
		
		function saveConf(){
			chrome.extension.sendMessage({method: "setConf",data:confStore});
		}
		
		function removeDefunctConfs(){
			for(var i in confStore){
				if(defaultConfs[i] === undefined){
					delete confStore[i];
				}
			}
			for(var i in defaultConfs){
				if(confStore[i] === undefined){
					confStore[i] = defaultConfs[i];
				}
			}
			saveConf();
		}
		
		function makeInput(id, type, dis_, q){
			if(defaultConfs[id] === undefined){
				debug(103, "makeInput(): Hmm... this id isn't in defaultConfs, something is wrong :( " + id);
			}
			if(!q){
				var q = '';
			}
			if(type == 'checkbox'){
				return '<span style=\'float: right !important;\'><input id="' + id + '" name="conf" value="' + id + '" type="checkbox" ' + getConfForm(id) + dis_ + '/></span>';
			}
			if(type == 'text'){
				return '<span style=\'float: right !important;\'><input id="' + id + '" name="conf" value="' + getConf(id) + '" type="textarea" ' + dis_ + '"/></span>';
			}
			if(type == 'radio2'){
				return '<span style=\'float: right !important;\'>' + q + '<input id="' + id + '" name="conf" value="right" type="radio" ' + getConfForm2(id) + dis_ + '/></span>';
			}
			if(type == 'radio1'){
				return '<span style=\'float: right !important;\'>' + q + '<input id="' + id + '" name="conf" value="left" type="radio" ' + getConfForm(id) + dis_ + '/></span>';
			}
			debug(104, "Invalid type for makeInput: " + id + "\t" + type + "\t" + dis_);
			return '';
		}

		function getKeys(a){
			var r = [];
			for(var k in a){
				r.push(k);
			}
			return r;
		}
		
		function nrKeys(a){
			var i = 0;
			for(var key in a){
				i++;
			}
			return i;
		}

		function compareAssociativeArrays(a, b, depth){
			if(a == b){
				return true;
			}
			if(nrKeys(a) != nrKeys(b)){
				return false;
			}
			if(depth == undefined){
				var depth = 0;
			} else if(depth > 3){
				return true; //hopefully they actually are the same... :p
			}
			for(var key in a){
				if(noCloneNames[key]){}
				else if(typeof (a[key]) === "object" && typeof (b[key]) === "object"){
					if(!compareAssociativeArrays(a[key], b[key], depth + 1)){
						return false;
					}
				}else if(a[key] != b[key]){
					return false;
				}
			}
			return true;
		}
		function onChange(){
			var oconf = cloness(confStore),refreshPage = false;
			for(var i in settingsForm.elements){
				i = +i;
				if(isNaN(i)){
					continue;
				}
				if(settingsForm.elements[i].checked !== undefined && settingsForm.elements[i].type === "checkbox"){
					confStore[settingsForm.elements[i].id] = settingsForm.elements[i].checked;
				} else if(settingsForm.elements[i].type.substr(0, 4) === "text"){
					confStore[settingsForm.elements[i].id] = settingsForm.elements[i].value;
				} else if(settingsForm.elements[i].type === "radio"){
					if(settingsForm.elements[i].checked){
						confStore[settingsForm.elements[i].id] = (settingsForm.elements[i].value === "left");
					}
				}
			}
			if(getConf("emoteManagerWindowStyleType")){
				confStore["emoteManagerWindowStyle"] = defaultConfs["emoteManagerWindowStyle"];
			}
			if(!compareAssociativeArrays(confStore, oconf)){
				saveConf();
				makeWindow();
			}
			
		};
		
		function uniq(a){
			var o = {}, i, l = a.length, r = [];
			for(i=0; i<l;i+=1) o[a[i]] = a[i];
			for(i in o) r.push(o[i]);
			return r;
		}
		
		function editBlacklist(){
			closeEditBlacklist();
			var elem = document.createElement("div");
			elem.id = "editBlacklistWindow";
			var eHTML = "<h3 style='margin-bottom: 3px; margin-top: 3px;'>Edit emote blacklist</h3>";
			eHTML += "Enter emote names here, separated by commas.<br /><textarea style='width: 85%; height: 40%;' id='Cedit'></textarea>";
			eHTML += "<input type='textbox' id='Cbl'/><input type='button' id='Cabl' value='Blacklist emotes containing this.'/>";
			eHTML += "<input style='float:right;' id='Cclose' type='button' value='done'/>";
			elem.innerHTML = eHTML;
			document.body.appendChild(elem);
			document.getElementById('Cedit').value = getConf("emoteBlacklist").join(",");
			var c = document.getElementById('Cclose');
			c.addEventListener("click",function(evt){
				setConf("emoteBlacklist",document.getElementById('Cedit').value.split(","));
				closeEditBlacklist();
				setConf("shouldReset",true);
			});
			c = document.getElementById('Cabl');
			c.addEventListener("click",function(evt){
				var blEmotes = document.getElementById('Cedit').value.split(",");
				blEmotes = blEmotes.concat(findEmotes(document.getElementById('Cbl').value, false, true));
				console.log("Searched for: "+ document.getElementById('Cbl').value);
				blEmotes = uniq(blEmotes);
				setConf("emoteBlacklist",blEmotes);
				document.getElementById('Cedit').value = blEmotes.join(",");
				setConf("shouldReset",true);
			});
		}
		
		function closeEditBlacklist(){
			var elem = document.getElementById("editBlacklistWindow");
			if(elem){
				elem.parentNode.removeChild(elem);
			}
		}
		
		function updateGroups(){
			if(getConf('lastDefaultEmoteGroups')){
			
			}
			setConf('lastDefaultEmoteGroups',defaultConfs['emoteGroups']);
		}
		
		function editGroup(group){
			closeEditGroup();
			var elem = document.createElement("div");
			elem.id = "editGroupWindow";
			var groups = getConf("emoteGroups");
			var eHTML = "<h3 style='margin-bottom: 3px; margin-top: 3px;'>Edit subs in " + groups[group].name + "</h3>";
			eHTML += "<textarea style='width: 95%; height: 40%;' id='Cedit'></textarea>";
			eHTML += "<input id='Csave' type='button' value='save'/><input id='Ccancel' type='button' value='cancel'/>";
			elem.innerHTML = eHTML;
			document.body.appendChild(elem);
			var c = document.getElementById('Ccancel');
			c.addEventListener("click",function(evt){
				closeEditGroup();
			});
			document.getElementById('Cedit').value = groups[group].subs.join(",");
			var c = document.getElementById('Csave');
			c.addEventListener("click",function(evt){
				groups[group].subs = document.getElementById('Cedit').value.split(",");
				closeEditGroup();
				manageSubs();
				setConf("shouldReset",true);
			});
		}
		
		function closeEditGroup(){
			var elem = document.getElementById("editGroupWindow");
			if(elem){
				elem.parentNode.removeChild(elem);
			}
		}
		
		function manageSubs(){
			var msHTML = "<a href='#' id='editBlacklist' style='float:right;'>Edit emote blacklist</a><br /><table id='G_manageSubs'><tr><th>Group</th><th>NSFW</th><th>enabled</th></tr>";
			var groups = getConf("emoteGroups");
			var groupOrder = getConf("emoteGroupsOrder");
			var nsfw = false;
			for(var i = 0; i < groupOrder.length; i++){
				var group = groups[groupOrder[i]];
				msHTML += "<tr><td>"+group.name+"</td><td>"+(group.nsfw?"☑":"☐")+"</td><td><input type='checkbox' name='"+groupOrder[i]+"' id='C_"+groupOrder[i]+"'"+(group.enabled?" checked='checked'":"")+"/> <a class='G_Ce' id='Cu_"+groupOrder[i]+"' name='"+groupOrder[i]+"'> &#8593 </a><a class='G_Ce' id='Cd_"+groupOrder[i]+"' name='"+groupOrder[i]+"'> &#8595; </a><a id='Ce_"+groupOrder[i]+"' name='"+groupOrder[i]+"'> edit</a></td></tr>";
				if(group.nsfw && group.enabled){
					nsfw = true;
				}
			}
			setConf("nsfwDefunctEmotes",nsfw);
			msHTML += "</table>";
			document.getElementById('manageSubs').innerHTML = msHTML;
			for(var i in groups){
				var c = document.getElementById('C_'+i);
				c.addEventListener("change",function(evt){
					if(evt.target.checked && confStore['emoteGroups'][evt.target.name].nsfw && !getConf("nsfwDefunctEmotes") && !confirm("Are you sure you want to enable this? It's NSFW!")){
						evt.target.checked = false;
						return;
					}
					confStore['emoteGroups'][evt.target.name].enabled = evt.target.checked;
					saveConf();
					manageSubs();
					setConf("shouldReset",true);
				});
				c = document.getElementById('Cu_'+i);
				c.addEventListener("click",function(evt){
					evt.preventDefault();
					evt.stopPropagation();
					moveGroup(evt.target.name, -1);
					return false;
				});
				c = document.getElementById('Cd_'+i);
				c.addEventListener("click",function(evt){
					evt.preventDefault();
					evt.stopPropagation();
					moveGroup(evt.target.name, 1);
					return false;
				});
				c = document.getElementById('Ce_'+i);
				c.addEventListener("click",function(evt){
					evt.preventDefault();
					evt.stopPropagation();
					editGroup(evt.target.name);
					return false;
				});
			}
			c = document.getElementById('editBlacklist');
			c.addEventListener("click",function(evt){
				evt.preventDefault();
				evt.stopPropagation();
				editBlacklist();
				return false;
			});
		}
		
		function moveGroup(group, d){
			var source = confStore['emoteGroupsOrder'].indexOf(group);
			var destination = confStore['emoteGroupsOrder'].indexOf(group)+d;
			if(source < 0 || source >= confStore['emoteGroupsOrder'].length || destination < 0 || destination >= confStore['emoteGroupsOrder'].length){
				return;
			}
			var temp = confStore['emoteGroupsOrder'][destination];
			confStore['emoteGroupsOrder'][destination] = group;
			confStore['emoteGroupsOrder'][source] = temp;
			saveConf();
			manageSubs();
			setConf("shouldReset",true);
		}
		
		function getSubList(){
			var groups = getConf("emoteGroups");
			var subs = [], grps = [];
			for(var i in groups){
				grps.unshift(i);
			}
			for(var i = 0; i < grps.length; i++){
				var group = groups[grps[i]];
				if(group.enabled){
					for(var ii = 0; ii < group.subs.length; ii++){
						subs.push(group.subs[ii]);
					}
				}
			}
			return subs.join(",");
		}
		
		function makeWindow(){
			if(unsupported){
				superBundlePrefs.innerHTML = "<span style='text-color: red; text-style: bold;'>For some reason we can't seem to save configuration data - did you remember to install TamperMonkey if you're using Chrome? Make sure you did, remove this script from your extensions, and install it again, making sure to click ok when it asks you if you want to install it with TamperMonkey.</span><br />";
				return;
			}
			var dis = {'all':'','E':'','F':'','G':'','S':'','FF':' disabled=\'disabled\'','WK':' disabled=\'disabled\''};

			if(!getConf("defaultEmoteContainer")){
				dis.E = " disabled='disabled'";
			}
			if(!getConf("emoteManagerEverywhere")){
				dis.G = " disabled='disabled'";
				dis.F = dis.G;
			}
			if(getConf("emoteManagerWindowStyleType")){
				dis.S = " disabled='disabled'";
			}
			if(isFF){
				dis.FF = '';
			}
			if(isWebKit){
				dis.WK = '';
			}
			if(compareAssociativeArrays(oldDis,dis)){
				return;
			}
			oldDis = dis;
			var prefHTML = "<h3 style='font-size:110%'>GrEmB Configuration</h3><br /><form action='#' name='settingsForm' id='settingsForm'>";
			
			prefHTML += 'Include Emote Window?' + makeInput('defaultEmoteContainer', 'checkbox', dis.all);
			prefHTML += '<br />&#160;&#160;Display emote window everywhere instead of just reddit?' + makeInput('defaultEmoteContainerEverywhere', 'checkbox', dis.E);
			prefHTML += '<br />&#160;&#160;Display emote window on top of reddit header?' + makeInput('defaultEmoteContainerOnTop', 'checkbox', dis.E);
			prefHTML += '<br />&#160;&#160;Close the emote window when your mouse leaves it?' + makeInput('defaultEmoteContainerMouseLeave', 'checkbox', dis.E);
			prefHTML += '<br />&#160;&#160;Which side of the screen should the Emote Window be displayed on?' + makeInput('defaultEmoteContainerSide', 'radio2', dis.E, "Right:") + makeInput('defaultEmoteContainerSide', 'radio1', dis.E, "Left:");
			prefHTML += '<br />&#160;&#160;Include r/mylittleandysonic1 emotes?' + makeInput('defaultEmoteContainerMLAS1', 'checkbox', dis.E);
			prefHTML += '<br />&#160;&#160;Include r/idliketobeatree emotes?' + makeInput('defaultEmoteContainerILTBAT', 'checkbox', dis.E);
			prefHTML += '<br />&#160;&#160;Use small emote window toggler?' + makeInput('smallToggler', 'checkbox', dis.E);
			prefHTML += '<br />&#160;&#160;Use Easy Emotes style emote window?' + makeInput('emoteManagerWindowStyleType', 'checkbox', dis.E) + (getConf("emoteManagerWindowStyleType")?'':('<br />&#160;&#160;&#160;&#160;What custom CSS style should be used?' + makeInput('emoteManagerWindowStyle', 'text', (dis.E || dis.S))));
			prefHTML += '<br />&#160;&#160;Emote window vertical position in pixels (Use 41 to line up for RES)' + makeInput("defaultEmoteContainerY", "text", dis.E);
			prefHTML += '<br />&#160;&#160;Emote window width in pixels' + makeInput("defaultEmoteContainerWidth", "text", dis.E);
			prefHTML += '<br />&#160;&#160;Emote window height in pixels' + makeInput("defaultEmoteContainerHeight", "text", dis.E);
			prefHTML += '<br /><br />Wide reddit mode - messages/posts display across the full width' + makeInput('wideReddit', 'checkbox', dis.all);
			prefHTML += '<br />Reveal alt-text?' + makeInput('revealAltText', 'checkbox', dis.all);
			prefHTML += '<br />Show pony emotes globally?' + makeInput('emoteManagerEverywhere', 'checkbox', dis.all);
			prefHTML += '<br />&#160;&#160;Make copy-paste include emote text(FF only)' + makeInput("emoteCopy", "checkbox", dis.FF);
			prefHTML += '<div align="right" id="manageSubs"></div>';
			prefHTML += '<br /><b>Disable spinning/3D emotes?</b> (recommended unless you have a fast computer)' + makeInput('disableEmoteSpin', 'checkbox', dis.all);
			prefHTML += '<br /><input id="saveSubmit" name="conf" type="submit" value="save"' + dis.all + '/>' + "</form>";
			superBundlePrefs.innerHTML = prefHTML;
			settingsForm = document.getElementById('settingsForm');
			settingsForm.addEventListener("change", onChange);
			document.getElementById('saveSubmit').addEventListener("click", function(){onChange();window.location.reload();});
			manageSubs();
		}
		
		function addConf(){
			if(madeConf){
				return;
			}
			superBundlePrefs = document.getElementById("superBundleConfAnchor");
			if(superBundlePrefs){
				document.getElementById("installInstructions").innerHTML = '';
				document.getElementById("updateInstructions").setAttribute('style', '');
				document.getElementById("yourVersion").innerHTML = localVersion;
				var currentVersion = (+(document.getElementById("currentVersion").textContent));
				if(currentVersion <= localVersion){
					
				}else{
					
				}
				var style = ".confPanel input{padding: none; margin: 0 0 0 0;}.confPanel input[type='textarea']{height: 12px;}.confPanel br {line-height: 10px;}.confPanel {border: 1px solid #E1B000; background-color: #FFFDCC; top: 60px; position: fixed;} .confPanel {min-height: 10%; max-height: 85%; overflow-y: scroll; width: 48%; height: auto; z-index: 0 !important; left: 10px !important;margin-left: 10px !important; margin-right: 10px !important; font-size: small !important; line-height: 20px; padding-right: 10px;} #page {width: 55% !important; margin-left: 52% !important;}";
				addCSS(style);
				showCSS();
				superBundlePrefs.setAttribute("id", "superBundleConfPanel");
				superBundlePrefs.setAttribute("class", "confPanel");
				makeWindow();
				window.addEventListener("resize", resizeConf());
				resizeConf();
				madeConf = true;
			}
		};
		
		function resizeConf(evt){
			superBundlePrefs.setAttribute("style", "max-height: " + (window.innerHeight-80));
		}
		
		function addCSS(rule){
			cssStore += ("\r\n \r\n" + rule + "\r\n \r\n");
		}
		
		function showCSS(){
			if(!cssElement){
				cssElement = document.createElement('style');
				cssElement.type = 'text/css';
				cssElement.appendChild(document.createTextNode(cssStore));
				document.head.appendChild(cssElement);
			}else{
				cssElement.insertBefore(document.createTextNode(cssStore),cssElement.firstChild);
			}
			cssStore = '';
		}

		function setCursor(node, pos){ //Thanks stack overflow! http://stackoverflow.com/questions/1865563/set-cursor-at-a-length-of-14-onfocus-of-a-textbox
			var node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;
			if(!node){
				return false;
			} else if(node.createTextRange){
				var textRange = node.createTextRange();
				textRange.collapse(true);
				textRange.moveEnd(pos);
				textRange.moveStart(pos);
				textRange.select();
				return true;
			} else if(node.setSelectionRange){
				node.setSelectionRange(pos, pos);
				return true;
			}
			return false;
		}

		function getCursorPos(){
			var range = document.selection.createRange();
			var bookmark = range.getBookmark();
			return bookmark.charCodeAt(2) - 11;
		}

		function addEmote(event, id){
			var emoteID, startPos, endPos, formLength, className = event.target.getAttribute("class");
			if(!className||!currentForm){
				return true;
			}
			emoteID = className.match((/^G_(.+?)_(?: G_small)?$/))[1];
			
			if(!emoteID){
				return true;
			}
			event.stopPropagation();
			event.preventDefault();
			emoteID = emoteID + (event.ctrlKey ? '-inp':'') + (event.altKey ? '-r': '') + (event.shiftKey ? '-d': '');
			
			
			if(currentForm.value !== undefined){
				startPos = currentForm.selectionStart;
				endPos = currentForm.selectionEnd;
				formLength = currentForm.value.length;

				if(startPos != endPos){
					currentForm.value = currentForm.value.substring(0, startPos) + "[](/" + emoteID + " \"" + currentForm.value.substring(startPos, endPos) + "\")" + currentForm.value.substring(endPos);
				} else {
					currentForm.value = currentForm.value.substring(0, startPos) + "[](/" + emoteID + ")" + currentForm.value.substring(startPos);
				}
				currentForm.setSelectionRange(endPos + (currentForm.value.length - formLength), endPos + (currentForm.value.length - formLength));
			} else if(currentForm.innerText !== undefined){
				if(window.getSelection){
					startPos = window.getSelection().anchorOffset;
					endPos = window.getSelection().focusOffset;
				} else {
					startPos = getCursorPos();
					endPos = startPos;
				}
				formLength = currentForm.innerText.length;

				if(startPos != endPos){
					currentForm.innerText = currentForm.innerText.substring(0, startPos) + "[](/" + emoteID + " \"" + currentForm.innerText.substring(startPos, endPos) + "\")" + currentForm.innerText.substring(endPos);
				} else {
					currentForm.innerText = currentForm.innerText.substring(0, startPos) + "[](/" + emoteID + ")" + currentForm.innerText.substring(startPos);
				}
				setCursor(currentForm, endPos + (currentForm.innerText.length - formLength), endPos + (currentForm.innerText.length - formLength));
			}
			currentForm.focus();
			if(!getConf('defaultEmoteContainerMouseLeave')){
				toggleEmoteWindow(event, id, 1);
			}
			return;
		}
		
		function addTabs(){
			var containers = document.getElementsByClassName("GrEmBEmoteList");
			var currentTab = 0;
			for(var c = 0; c < containers.length; c++){
				tabs[currentTab] = containers[c];
				++currentTab;
			}
		}
		
		function openTab(evt){
			evt.preventDefault();
			evt.stopPropagation();
			var tabID = evt.target.getAttribute('tabID');
			if(tabID === undefined || tabID === false || tabID === null){
				return false;
			}
			var tabHeaders = document.getElementById("GrEmBtablist").childNodes[0];
			for(var t =0; t < tabHeaders.childNodes.length; t++){
				var tab = tabHeaders.childNodes[t].firstChild;
				var tID = tab.getAttribute('tabID');
				if(tabID == tID){
					tabs[tID].setAttribute("class", "GrEmBEmoteList");
				}else{
					tabs[tID].setAttribute("class", "GrEmBEmoteList closedTab");
				}
			}
			return false;
		}
		function updateCurrentForm(){
			if(!setUpTabs && (getConf("defaultEmoteContainerMLAS1") || getConf("defaultEmoteContainerILTBAT"))){
				if(!document.getElementById("GrEmBtablist")){
					debug(104, "Still no element? :S");
					return;
				}
				document.getElementById("GrEmBtablist").addEventListener("click", function (evt){
					openTab(evt);
				}, false);
				setUpTabs = true;
			}
			if(document.activeElement == document.body){
				return;
			}
			if((document.activeElement.id != "emName")&&(document.activeElement.tagName == "INPUTBOX" || document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA" || (document.activeElement.contentEditable && document.activeElement.tagName == "DIV"))&&(currentForm != document.activeElement || (window.frames[document.activeElement.name] && window.frames[document.activeElement.name].window && window.frames[document.activeElement.name].window.document && window.frames[document.activeElement.name].window.document.activeElement != currentForm))){
				currentForm = document.activeElement;
				if(currentForm.tagName == "IFRAME"){
					if(document.activeElement.contentWindow || document.activeElement.contentDocument){
						currentForm = document.activeElement.contentWindow.document.activeElement || document.activeElement.contentDocument.document.activeElement;
					} else {
						currentForm = window.frames[document.activeElement.name].window.document.activeElement;
					}
				}
			}

		}

		function toggleEmoteWindow(evt, id, f){
			var emoteWindow = document.getElementById("GrEmBEmoteWindow" + id);
			if(!emoteWindow){
				windowCreators[id]();
				emoteWindow = document.getElementById("GrEmBEmoteWindow" + id);
			}
			if(!emoteWindow){
				return debug(103, "Could not find emote window with ID: GrEmBEmoteWindow" + id + "... :( Something broke, report this error.");
			}
			if(f){
				emoteWindow.setAttribute("class", closedWindowClasses);
			} else {
				emoteWindow.setAttribute("class", (emoteWindow.getAttribute("class") == windowClasses) ? closedWindowClasses : windowClasses);
			}
			evt.preventDefault();
			evt.stopPropagation();
			evt.cancelBubble = true;
		}

		function mouseEnter(_fn){
			return function (_evt){
				var relTarget = _evt.relatedTarget;
				if(this === relTarget || isAChildOf(this, relTarget)){
					return;
				}
				_fn.call(this, _evt);
			}
		}

		function isAChildOf(_parent, _child){
			if(_parent === _child){
				return false;
			}
			var limit = 0;
			while(_child && _child !== _parent && limit < 10){
				_child = _child.parentNode;
				limit++;
			}
			if(limit >= 10){
				return false;
			}
			return _child === _parent;
		}
		
		function createEmoteWindow(id, side, x, y, z, w, h, emotes, name){ //Window ID,side,xPos,Ypos,zPos(Depth/zIndex),width,height,innerHTML for the emotes.
			if(window !== window.top){
				return;
			}
			if(document.getElementById("GrEmBEmoteToggle" + id)){
				return;
			}
			var windowToggler = document.createElement("div");
			windowToggler.id = "GrEmBEmoteToggle" + id;
			windowToggler.className = "GrEmBWindow";
			windowToggler.setAttribute("style", "color: black; z-index: " + z + "; position: fixed !important; top: " + y + "px; " + side + ": 10px;");
			var toggleText = '';
			if(side === "right"){
				toggleText = "<b>&lt;&lt;</b>" + name;
			} else {
				toggleText = name + "<b>&gt;&gt;</b>";
			}
			windowToggler.innerHTML = '<span class="GrEmBTitleText">' + toggleText + '</span>';
			document.body.appendChild(windowToggler);

			windowCreators[id] = function(){
				var emoteWindow = document.createElement("div");
				emoteWindow.id = "GrEmBEmoteWindow" + id;
				emoteWindow.className = closedWindowClasses + " closedTab";
				emoteWindow.setAttribute("style", "color: black; z-index: " + (z + 1) + "; position: fixed !important; top: " + y + "px; " + side + ": 10px; width: " + w + "px; height: " + h + "px; max-width: " + ((+w) + 30) + "px; max-height: " + ((+h) + 30) + "px;");
				lt = rt = '';
				if(side === "right"){
					rt = '<span style="float: left; cursor: pointer; font-weight: bold; text-decoration: underline overline;" class="GrEmBTitleText" id="closeEmoteWindow' + id + '">X</span>&#160;&#160; ';
				} else {
					rt = ' &#160;&#160;<span style="float: right; cursor: pointer; font-weight: bold; text-decoration: underline overline;" class="GrEmBTitleText" id="closeEmoteWindow' + id + '">X</span>';
				}
				emoteWindow.innerHTML = "<span style='float: " + side + ";'>" + 'Click to place</span>' + rt + emotes() + '';
				
				document.body.appendChild(emoteWindow);
				
				emoteWindow.addEventListener("click", function (evt){
					return addEmote(evt, id);
				}, false);
				if(getConf("defaultEmoteContainerMouseLeave")){
					function closeFunc(evt){
							evt.stopPropagation();
							evt.cancelBubble = true;
							toggleEmoteWindow(evt, id, 1);
							if(currentForm){
								currentForm.focus();
							}
							evt.preventDefault();
						}
					emoteWindow.addEventListener('mouseout', mouseEnter(closeFunc), false);
				}
				document.getElementById('closeEmoteWindow'+id).addEventListener("click", function (evt){
					toggleEmoteWindow(evt, id, 1);
				}, false);
				emoteWindow.addEventListener("mouseover", function (evt){
					updateCurrentForm();
					return true;
				}, false);
				document.getElementById("emName").addEventListener("change",findEmotesChange);
				document.getElementById("emName").addEventListener("keydown",findEmotesChange);
				document.getElementById("emName").addEventListener("paste",findEmotesChange);
				document.getElementById("emNameReg").addEventListener("change",emoteRegChange);
				document.getElementById("GrEmBSearchList").innerHTML = ""+document.getElementById("GrEmBdefaultcontainer").firstChild.innerHTML;
				addTabs();
			}
			windowToggler.addEventListener("mouseover", function (evt){
				toggleEmoteWindow(evt, id);
			}, false);
		}

		function getDefaultEmoteHTML(){
			var lss = "font-size: 10pt; margin: 0; padding: 0; list-style: none !important;";
			var ls = lss + " display: inline-block !important; border: solid; border-width: 1px 1px 0 1px; margin: 0 0.15em 0 0;";
			var lsa = "padding: 0 0.15em;";
			var emotes = "";
			var search = "";
			var mlas1 = "";
			var iltbat = "";
			var currentTabID = 0;
			if(getConf('defaultEmoteContainerSearch')){
				search = '<li style="' + ls + '"><a style="' + lsa + '" href="#" tabID="' + currentTabID++ + '">find</a></li>';
			}
			var mlpTabID = currentTabID++;
			if(getConf('defaultEmoteContainerMLAS1')){
				mlas1 = '<li style="' + ls + '"><a style="' + lsa + '" href="#" tabID="' + currentTabID++ + '">mlas</a></li>';
			}
			if(getConf('defaultEmoteContainerILTBAT')){
				iltbat = '<li style="' + ls + '" id="selected"><a style="' + lsa + '" href="#" tabID="' + currentTabID++ + '">iltbat</a></li>';
			}
			
			if(search || mlas1 || iltbat){
				emotes = '<span id="GrEmBtablist"><ul class="GrEmBtabs" style="' + lss + '">' + search + '<li  style="' + ls + '" class="GrEmBtabs"><a tabID="'+mlpTabID+'" style="' + lsa + '" href="#">mlp</a></li>' + mlas1 + iltbat + '</ul></span>';
			}
			if(search != ""){
				emotes += "<div id='GrEmBsearchcontainer' style='overflow-y: auto !important;' class='GrEmBEmoteList'><label for='emName'>search:</label><input type='text' name='search' id='emName' style='max-width: 80%;'/><input title='Use regular expressions for search(advanced)' id=\"emNameReg\" type=\"checkbox\""+(getConf("emoteSearchReg")?" checked=\"checked\"":"")+"/><div id='GrEmBSearchList' style='height: " + (getConf("defaultEmoteContainerHeight") - 65) + "px; overflow-y: scroll !important;' class='GrEmBEmoteList_'></div></div>";
			}
			emotes += "<div id='GrEmBdefaultcontainer' class='GrEmBEmoteList closedTab'><div class='GrEmBEmoteList_'>";
			emotes += "<div title='/flutterfear' class='G_flutterfear_'></div><div title='/ppboring' class='G_ppboring_'></div><div title='/rarityyell' class='G_rarityyell_'></div><div title='/fluttershy' class='G_fluttershy_'></div><div title='/ajcower' class='G_ajcower_'></div><div title='/ajsly' class='G_ajsly_'></div><div title='/eeyup' class='G_eeyup_'></div><div title='/rdsmile' class='G_rdsmile_'></div><div title='/fluttersrs' class='G_fluttersrs_'></div><div title='/raritydress' class='G_raritydress_'></div><div title='/takealetter' class='G_takealetter_'></div><div title='/rdwut' class='G_rdwut_'></div><div title='/ppshrug' class='G_ppshrug_'></div><div title='/spikenervous' class='G_spikenervous_'></div><div title='/noooo' class='G_noooo_'></div><div title='/dj' class='G_dj_'></div><div title='/fluttershh' class='G_fluttershh_'></div><div title='/flutteryay' class='G_flutteryay_'></div><div title='/squintyjack' class='G_squintyjack_'></div><div title='/spikepushy' class='G_spikepushy_'></div><div title='/ajugh' class='G_ajugh_'></div><div title='/raritywut' class='G_raritywut_'></div><div title='/dumbfabric' class='G_dumbfabric_'></div><div title='/raritywhy' class='G_raritywhy_'></div><div title='/trixiesmug' class='G_trixiesmug_'></div><div title='/flutterwink' class='G_flutterwink_'></div><div title='/rarityannoyed' class='G_rarityannoyed_'></div><div title='/soawesome' class='G_soawesome_'></div><div title='/ajwut' class='G_ajwut_'></div><div title='/twisquint' class='G_twisquint_'></div><div title='/raritywhine' class='G_raritywhine_'></div><div title='/rdcool' class='G_rdcool_'></div><div title='/abwut' class='G_abwut_'></div><div title='/manspike' class='G_manspike_'></div><div title='/cockatrice' class='G_cockatrice_'></div><div title='/facehoof' class='G_facehoof_'></div><div title='/rarityjudge' class='G_rarityjudge_'></div><div title='/rarityprimp' class='G_rarityprimp_'></div><div title='/twirage' class='G_twirage_'></div><div title='/ppseesyou' class='G_ppseesyou_'></div><div title='/ajlie' class='G_ajlie_'></div><div title='/priceless' class='G_priceless_'></div><div title='/flutterjerk' class='G_flutterjerk_'></div><div title='/twipride' class='G_twipride_'></div><div title='/celestiamad' class='G_celestiamad_'></div><div title='/twicrazy' class='G_twicrazy_'></div><div title='/lunateehee' class='G_lunateehee_'></div><div title='/lunawait' class='G_lunawait_'></div><div title='/derpwizard' class='G_derpwizard_'></div><div title='/ajhappy' class='G_ajhappy_'></div><div title='/pinkiefear' class='G_pinkiefear_'></div><div title='/twibeam' class='G_twibeam_'></div><div title='/raritydaww' class='G_raritydaww_'></div><div title='/scootacheer' class='G_scootacheer_'></div><div title='/swagintosh' class='G_swagintosh_'></div><div title='/ajsup' class='G_ajsup_'></div><div title='/flutterwhoa' class='G_flutterwhoa_'></div><div title='/rdsad' class='G_rdsad_'></div><div title='/ohcomeon' class='G_ohcomeon_'></div><div title='/ppcute' class='G_ppcute_'></div><div title='/abbored' class='G_abbored_'></div><div title='/raritynews' class='G_raritynews_'></div><div title='/sbbook' class='G_sbbook_'></div><div title='/scootaplease' class='G_scootaplease_'></div><div title='/twiright' class='G_twiright_'></div><div title='/celestiawut' class='G_celestiawut_'></div><div title='/grannysmith' class='G_grannysmith_'></div><div title='/shiningarmor' class='G_shiningarmor_'></div><div title='/chrysalis' class='G_chrysalis_'></div><div title='/cadence' class='G_cadence_'></div><div title='/rdsitting' class='G_rdsitting_'></div><div title='/rdhappy' class='G_rdhappy_'></div><div title='/rdannoyed' class='G_rdannoyed_'></div><div title='/twismug' class='G_twismug_'></div><div title='/twismile' class='G_twismile_'></div><div title='/twistare' class='G_twistare_'></div><div title='/ohhi' class='G_ohhi_'></div><div title='/party' class='G_party_'></div><div title='/hahaha' class='G_hahaha_'></div><div title='/flutterblush' class='G_flutterblush_'></div><div title='/gross' class='G_gross_'></div><div title='/derpyhappy' class='G_derpyhappy_'></div><div title='/ajfrown' class='G_ajfrown_'></div><div title='/hmmm' class='G_hmmm_'></div><div title='/joy' class='G_joy_'></div><div title='/raritysad' class='G_raritysad_'></div><div title='/fabulous' class='G_fabulous_'></div><div title='/derp' class='G_derp_'></div><div title='/louder' class='G_louder_'></div><div title='/lunasad' class='G_lunasad_'></div><div title='/derpyshock' class='G_derpyshock_'></div><div title='/pinkamina' class='G_pinkamina_'></div><div title='/loveme' class='G_loveme_'></div><div title='/lunagasp' class='G_lunagasp_'></div><div title='/scootaloo' class='G_scootaloo_'></div><div title='/celestia' class='G_celestia_'></div><div title='/angel' class='G_angel_'></div><div title='/allmybits' class='G_allmybits_'></div><div title='/zecora' class='G_zecora_'></div><div title='/photofinish' class='G_photofinish_'></div><div title='/fillytgap' class='G_fillytgap_'></div><div title='/rdhuh' class='G_rdhuh_'></div><div title='/snails' class='G_snails_'></div><div title='/lyra' class='G_lyra_'></div><div title='/bonbon' class='G_bonbon_'></div><div title='/spitfire' class='G_spitfire_'></div><div title='/cutealoo' class='G_cutealoo_'></div><div title='/happyluna' class='G_happyluna_'></div><div title='/sotrue' class='G_sotrue_'></div><div title='/wahaha' class='G_wahaha_'></div><div title='/sbstare' class='G_sbstare_'></div><div title='/punchdrunk' class='G_punchdrunk_'></div><div title='/huhhuh' class='G_huhhuh_'></div><div title='/absmile' class='G_absmile_'></div><div title='/dealwithit' class='G_dealwithit_'></div><div title='/nmm' class='G_nmm_'></div><div title='/whooves' class='G_whooves_'></div><div title='/rdsalute' class='G_rdsalute_'></div><div title='/octavia' class='G_octavia_'></div><div title='/colgate' class='G_colgate_'></div><div title='/cheerilee' class='G_cheerilee_'></div><div title='/ajbaffle' class='G_ajbaffle_'></div><div title='/abhuh' class='G_abhuh_'></div><div title='/thehorror' class='G_thehorror_'></div><div title='/twiponder' class='G_twiponder_'></div><div title='/spikewtf' class='G_spikewtf_'></div><div title='/awwyeah' class='G_awwyeah_'></div>";
			if(mlas1 != ""){
				emotes += "</div></div><div id='GrEmBMLAS1container' class='GrEmBEmoteList closedTab'><div class='GrEmBEmoteList_'>";
				emotes += "<div title='/z00' class='G_z00_'></div><div title='/z10' class='G_z10_'></div><div title='/z20' class='G_z20_'></div><div title='/z30' class='G_z30_'></div><div title='/z40' class='G_z40_'></div><div title='/z01' class='G_z01_'></div><div title='/z11' class='G_z11_'></div><div title='/z21' class='G_z21_'></div><div title='/z31' class='G_z31_'></div><div title='/z41' class='G_z41_'></div><div title='/z02' class='G_z02_'></div><div title='/z12' class='G_z12_'></div><div title='/z22' class='G_z22_'></div><div title='/z32' class='G_z32_'></div><div title='/z42' class='G_z42_'></div><div title='/z03' class='G_z03_'></div><div title='/z13' class='G_z13_'></div><div title='/z23' class='G_z23_'></div><div title='/z33' class='G_z33_'></div><div title='/z43' class='G_z43_'></div><div title='/z04' class='G_z04_'></div><div title='/z14' class='G_z14_'></div><div title='/z24' class='G_z24_'></div><div title='/z34' class='G_z34_'></div><div title='/z44' class='G_z44_'></div><div title='/z05' class='G_z05_'></div><div title='/z15' class='G_z15_'></div><div title='/z25' class='G_z25_'></div><div title='/z35' class='G_z35_'></div><div title='/z45' class='G_z45_'></div><div title='/z06' class='G_z06_'></div><div title='/z16' class='G_z16_'></div><div title='/z26' class='G_z26_'></div><div title='/z36' class='G_z36_'></div><div title='/z46' class='G_z46_'></div><div title='/z07' class='G_z07_'></div><div title='/z17' class='G_z17_'></div><div title='/z27' class='G_z27_'></div><div title='/z37' class='G_z37_'></div><div title='/z47' class='G_z47_'></div><div title='/y00' class='G_y00_'></div><div title='/y10' class='G_y10_'></div><div title='/y20' class='G_y20_'></div><div title='/y30' class='G_y30_'></div><div title='/y40' class='G_y40_'></div><div title='/y01' class='G_y01_'></div><div title='/y11' class='G_y11_'></div><div title='/y21' class='G_y21_'></div><div title='/y31' class='G_y31_'></div><div title='/y41' class='G_y41_'></div><div title='/y02' class='G_y02_'></div><div title='/y12' class='G_y12_'></div><div title='/y22' class='G_y22_'></div><div title='/y32' class='G_y32_'></div><div title='/y42' class='G_y42_'></div><div title='/y03' class='G_y03_'></div><div title='/y13' class='G_y13_'></div><div title='/y23' class='G_y23_'></div><div title='/y33' class='G_y33_'></div><div title='/y43' class='G_y43_'></div><div title='/y04' class='G_y04_'></div><div title='/y14' class='G_y14_'></div><div title='/y24' class='G_y24_'></div><div title='/y34' class='G_y34_'></div><div title='/y44' class='G_y44_'></div><div title='/y05' class='G_y05_'></div><div title='/y15' class='G_y15_'></div><div title='/y25' class='G_y25_'></div><div title='/y35' class='G_y35_'></div><div title='/y45' class='G_y45_'></div><div title='/y06' class='G_y06_'></div><div title='/y16' class='G_y16_'></div><div title='/y26' class='G_y26_'></div><div title='/y36' class='G_y36_'></div><div title='/y46' class='G_y46_'></div><div title='/y07' class='G_y07_'></div><div title='/y17' class='G_y17_'></div><div title='/y27' class='G_y27_'></div><div title='/y37' class='G_y37_'></div><div title='/y47' class='G_y47_'></div><div title='/x00' class='G_x00_'></div><div title='/x10' class='G_x10_'></div><div title='/x20' class='G_x20_'></div><div title='/x30' class='G_x30_'></div><div title='/x40' class='G_x40_'></div><div title='/x01' class='G_x01_'></div><div title='/x11' class='G_x11_'></div><div title='/x21' class='G_x21_'></div><div title='/x31' class='G_x31_'></div><div title='/x41' class='G_x41_'></div><div title='/x02' class='G_x02_'></div><div title='/x12' class='G_x12_'></div><div title='/x22' class='G_x22_'></div><div title='/x32' class='G_x32_'></div><div title='/x42' class='G_x42_'></div><div title='/x03' class='G_x03_'></div><div title='/x13' class='G_x13_'></div><div title='/x23' class='G_x23_'></div><div title='/x33' class='G_x33_'></div><div title='/x43' class='G_x43_'></div><div title='/x04' class='G_x04_'></div><div title='/x14' class='G_x14_'></div><div title='/x24' class='G_x24_'></div><div title='/x34' class='G_x34_'></div><div title='/x44' class='G_x44_'></div><div title='/v00' class='G_v00_'></div><div title='/v10' class='G_v10_'></div><div title='/v20' class='G_v20_'></div><div title='/v30' class='G_v30_'></div><div title='/v40' class='G_v40_'></div><div title='/v01' class='G_v01_'></div><div title='/v11' class='G_v11_'></div><div title='/v21' class='G_v21_'></div><div title='/v31' class='G_v31_'></div><div title='/v41' class='G_v41_'></div><div title='/v02' class='G_v02_'></div><div title='/v12' class='G_v12_'></div><div title='/v22' class='G_v22_'></div><div title='/v32' class='G_v32_'></div><div title='/v42' class='G_v42_'></div><div title='/v03' class='G_v03_'></div><div title='/v13' class='G_v13_'></div><div title='/v23' class='G_v23_'></div><div title='/v33' class='G_v33_'></div><div title='/v43' class='G_v43_'></div><div title='/w00' class='G_w00_'></div><div title='/w10' class='G_w10_'></div><div title='/w20' class='G_w20_'></div><div title='/w30' class='G_w30_'></div><div title='/w40' class='G_w40_'></div><div title='/w01' class='G_w01_'></div><div title='/w11' class='G_w11_'></div><div title='/w21' class='G_w21_'></div><div title='/w31' class='G_w31_'></div><div title='/w02' class='G_w02_'></div><div title='/w12' class='G_w12_'></div><div title='/w22' class='G_w22_'></div><div title='/w32' class='G_w32_'></div><div title='/w03' class='G_w03_'></div><div title='/w13' class='G_w13_'></div><div title='/w23' class='G_w23_'></div><div title='/w33' class='G_w33_'></div><div title='/w04' class='G_w04_'></div><div title='/w14' class='G_w14_'></div><div title='/w24' class='G_w24_'></div><div title='/w34' class='G_w34_'></div><div title='/clop00' class='G_clop00_'></div><div title='/clop10' class='G_clop10_'></div><div title='/clop20' class='G_clop20_'></div><div title='/clop30' class='G_clop30_'></div><div title='/clop40' class='G_clop40_'></div><div title='/clop01' class='G_clop01_'></div><div title='/clop11' class='G_clop11_'></div><div title='/clop21' class='G_clop21_'></div><div title='/clop31' class='G_clop31_'></div><div title='/clop41' class='G_clop41_'></div><div title='/clop02' class='G_clop02_'></div><div title='/clop12' class='G_clop12_'></div><div title='/clop22' class='G_clop22_'></div><div title='/clop32' class='G_clop32_'></div><div title='/clop42' class='G_clop42_'></div><div title='/clop03' class='G_clop03_'></div><div title='/clop13' class='G_clop13_'></div><div title='/clop23' class='G_clop23_'></div><div title='/clop33' class='G_clop33_'></div><div title='/clop43' class='G_clop43_'></div><div title='/clop04' class='G_clop04_'></div><div title='/clop14' class='G_clop14_'></div><div title='/clop24' class='G_clop24_'></div><div title='/clop34' class='G_clop34_'></div><div title='/clop44' class='G_clop44_'></div><div title='/clop05' class='G_clop05_'></div><div title='/clop15' class='G_clop15_'></div><div title='/clop25' class='G_clop25_'></div><div title='/clop35' class='G_clop35_'></div><div title='/clop45' class='G_clop45_'></div><div title='/zz00' class='G_zz00_'></div><div title='/zz10' class='G_zz10_'></div><div title='/zz20' class='G_zz20_'></div><div title='/zz30' class='G_zz30_'></div><div title='/zz40' class='G_zz40_'></div><div title='/zz01' class='G_zz01_'></div><div title='/zz11' class='G_zz11_'></div><div title='/zz21' class='G_zz21_'></div><div title='/zz31' class='G_zz31_'></div><div title='/zz41' class='G_zz41_'></div><div title='/zz02' class='G_zz02_'></div><div title='/zz12' class='G_zz12_'></div><div title='/zz22' class='G_zz22_'></div><div title='/zz32' class='G_zz32_'></div><div title='/zz42' class='G_zz42_'></div><div title='/zz03' class='G_zz03_'></div><div title='/zz13' class='G_zz13_'></div><div title='/zz23' class='G_zz23_'></div><div title='/zz33' class='G_zz33_'></div><div title='/zz43' class='G_zz43_'></div><div title='/lb00' class='G_lb00_'></div><div title='/lb10' class='G_lb10_'></div><div title='/lb20' class='G_lb20_'></div><div title='/lb30' class='G_lb30_'></div><div title='/lb40' class='G_lb40_'></div><div title='/lb01' class='G_lb01_'></div><div title='/lb11' class='G_lb11_'></div><div title='/lb21' class='G_lb21_'></div><div title='/lb31' class='G_lb31_'></div><div title='/lb41' class='G_lb41_'></div><div title='/lb02' class='G_lb02_'></div><div title='/lb12' class='G_lb12_'></div><div title='/lb22' class='G_lb22_'></div><div title='/lb32' class='G_lb32_'></div><div title='/lb42' class='G_lb42_'></div><div title='/lb03' class='G_lb03_'></div><div title='/lb13' class='G_lb13_'></div><div title='/lb23' class='G_lb23_'></div><div title='/lb33' class='G_lb33_'></div><div title='/lb43' class='G_lb43_'></div><div title='/lb04' class='G_lb04_'></div><div title='/lb14' class='G_lb14_'></div><div title='/lb24' class='G_lb24_'></div><div title='/lb34' class='G_lb34_'></div><div title='/lb44' class='G_lb44_'></div><div title='/lb05' class='G_lb05_'></div><div title='/lb15' class='G_lb15_'></div><div title='/lb25' class='G_lb25_'></div><div title='/lb35' class='G_lb35_'></div><div title='/lb45' class='G_lb45_'></div><div title='/yy00' class='G_yy00_'></div><div title='/yy10' class='G_yy10_'></div><div title='/yy20' class='G_yy20_'></div><div title='/yy30' class='G_yy30_'></div><div title='/yy40' class='G_yy40_'></div><div title='/yy01' class='G_yy01_'></div><div title='/yy11' class='G_yy11_'></div><div title='/yy21' class='G_yy21_'></div><div title='/yy31' class='G_yy31_'></div><div title='/yy41' class='G_yy41_'></div><div title='/yy02' class='G_yy02_'></div><div title='/yy12' class='G_yy12_'></div><div title='/yy22' class='G_yy22_'></div><div title='/yy32' class='G_yy32_'></div><div title='/yy42' class='G_yy42_'></div><div title='/ajhay' class='G_ajhay_'></div><div title='/ajsmile' class='G_ajsmile_'></div><div title='/ajsmug' class='G_ajsmug_'></div><div title='/ajstache' class='G_ajstache_'></div><div title='/gummy' class='G_gummy_'></div><div title='/ppfly' class='G_ppfly_'></div><div title='/tank' class='G_tank_'></div><div title='/ppforever' class='G_ppforever_'></div><div title='/ppfrown' class='G_ppfrown_'></div><div title='/ppstache' class='G_ppstache_'></div><div title='/pptoot' class='G_pptoot_'></div><div title='/rdsax' class='G_rdsax_'></div><div title='/rdwhat' class='G_rdwhat_'></div><div title='/who' class='G_who_'></div><div title='/scootachicken' class='G_scootachicken_'></div><div title='/cake' class='G_cake_'></div><div title='/bblove' class='G_bblove_'></div><div title='/guitar' class='G_guitar_'></div><div title='/lush' class='G_lush_'></div><div title='/raritux' class='G_raritux_'></div><div title='/twiflip' class='G_twiflip_'></div><div title='/sweetiestache' class='G_sweetiestache_'></div><div title='/ppmoney' class='G_ppmoney_'></div><div title='/creepybelle' class='G_creepybelle_'></div><div title='/creepymc' class='G_creepymc_'></div><div title='/twino' class='G_twino_'></div><div title='/dramaqueen' class='G_dramaqueen_'></div><div title='/rdawesome' class='G_rdawesome_'></div><div title='/lyou' class='G_lyou_'></div><div title='/bbyou' class='G_bbyou_'></div><div title='/ajwink' class='G_ajwink_'></div><div title='/ppahh' class='G_ppahh_'></div><div title='/scootie' class='G_scootie_'></div><div title='/ppgummy' class='G_ppgummy_'></div><div title='/ppfreakout' class='G_ppfreakout_'></div><div title='/rdlean' class='G_rdlean_'></div><div title='/flutterlean' class='G_flutterlean_'></div><div title='/radical' class='G_radical_'></div><div title='/awesome' class='G_awesome_'></div><div title='/ajdemon' class='G_ajdemon_'></div><div title='/trixwizard' class='G_trixwizard_'></div><div title='/rdwizard' class='G_rdwizard_'></div><div title='/evilenchantress' class='G_evilenchantress_'></div><div title='/flutterhug' class='G_flutterhug_'></div><div title='/forequestria' class='G_forequestria_'></div><div title='/scratch' class='G_scratch_'></div><div title='/lb06' class='G_lb06_'></div><div title='/worstpony' class='G_worstpony_'></div><div title='/rdgrin' class='G_rdgrin_'></div><div title='/flutterwhy' class='G_flutterwhy_'></div><div title='/ppwatching' class='G_ppwatching_'></div><div title='/rdstare' class='G_rdstare_'></div><div title='/rdwhy' class='G_rdwhy_'></div><div title='/rod' class='G_rod_'></div><div title='/spitwithit' class='G_spitwithit_'></div><div title='/lywithit' class='G_lywithit_'></div><div title='/hatwithit' class='G_hatwithit_'></div><div title='/gypsypie' class='G_gypsypie_'></div><div title='/discord' class='G_discord_'></div><div title='/discordsmile' class='G_discordsmile_'></div><div title='/scootanoms' class='G_scootanoms_'></div><div title='/telegram' class='G_telegram_'></div><div title='/twiwhy' class='G_twiwhy_'></div><div title='/sadtiara' class='G_sadtiara_'></div><div title='/tiara' class='G_tiara_'></div><div title='/spoon' class='G_spoon_'></div><div title='/pip' class='G_pip_'></div><div title='/sbevil' class='G_sbevil_'></div><div title='/sbsad' class='G_sbsad_'></div><div title='/abcute' class='G_abcute_'></div><div title='/abfreakout' class='G_abfreakout_'></div><div title='/abshocked' class='G_abshocked_'></div><div title='/fancypants' class='G_fancypants_'></div><div title='/dapper' class='G_dapper_'></div><div title='/zecorawat' class='G_zecorawat_'></div><div title='/disappoint' class='G_disappoint_'></div><div title='/macsmile' class='G_macsmile_'></div><div title='/pphello' class='G_pphello_'></div><div title='/sadtwi' class='G_sadtwi_'></div><div title='/spitflyer' class='G_spitflyer_'></div><div title='/elegance' class='G_elegance_'></div><div title='/ihaveyounow' class='G_ihaveyounow_'></div><div title='/puddinghead' class='G_puddinghead_'></div><div title='/twirobe' class='G_twirobe_'></div><div title='/vsguitar' class='G_vsguitar_'></div><div title='/braeburn' class='G_braeburn_'></div><div title='/liarmac' class='G_liarmac_'></div><div title='/ppquite' class='G_ppquite_'></div><div title='/mav' class='G_mav_'></div><div title='/dashdead' class='G_dashdead_'></div><div title='/derpyzap' class='G_derpyzap_'></div><div title='/heythere' class='G_heythere_'></div><div title='/manlytears' class='G_manlytears_'></div><div title='/scootidea' class='G_scootidea_'></div><div title='/fivewats' class='G_fivewats_'></div><div title='/onesquee' class='G_onesquee_'></div><div title='/ajwtf' class='G_ajwtf_'></div><div title='/ppscared' class='G_ppscared_'></div><div title='/moongusta' class='G_moongusta_'></div><div title='/surcookie' class='G_surcookie_'></div><div title='/sackflip' class='G_sackflip_'></div><div title='/darklewithit' class='G_darklewithit_'></div><div title='/darklefun' class='G_darklefun_'></div><div title='/ppohyou' class='G_ppohyou_'></div><div title='/spitfuck' class='G_spitfuck_'></div><div title='/twibook' class='G_twibook_'></div><div title='/twinuzzle' class='G_twinuzzle_'></div><div title='/goat' class='G_goat_'></div><div title='/yes' class='G_yes_'></div><div title='/emperorgummy' class='G_emperorgummy_'></div><div title='/fscrazy' class='G_fscrazy_'></div><div title='/macwink' class='G_macwink_'></div><div title='/gummyfez' class='G_gummyfez_'></div><div title='/raricute' class='G_raricute_'></div><div title='/rdcute' class='G_rdcute_'></div><div title='/twicute' class='G_twicute_'></div><div title='/ajcute' class='G_ajcute_'></div><div title='/fscute' class='G_fscute_'></div><div title='/dcute' class='G_dcute_'></div><div title='/flutterumm' class='G_flutterumm_'></div><div title='/flutterwhat' class='G_flutterwhat_'></div><div title='/queenawesome' class='G_queenawesome_'></div><div title='/rarigummy' class='G_rarigummy_'></div><div title='/pinkachu' class='G_pinkachu_'></div><div title='/bendover' class='G_bendover_'></div><div title='/pbf' class='G_pbf_'></div><div title='/scootasmile' class='G_scootasmile_'></div><div title='/sweetieww' class='G_sweetieww_'></div><div title='/thatswhatshysaid' class='G_thatswhatshysaid_'></div><div title='/twistparty' class='G_twistparty_'></div><div title='/brodyhover' class='G_brodyhover_'></div><div title='/cadancewat' class='G_cadancewat_'></div><div title='/chryswat' class='G_chryswat_'></div><div title='/cmcderp' class='G_cmcderp_'></div><div title='/discordwtf' class='G_discordwtf_'></div><div title='/doitfilly' class='G_doitfilly_'></div><div title='/flutalot' class='G_flutalot_'></div><div title='/gildafriendship' class='G_gildafriendship_'></div><div title='/QQfYQ' class='G_QQfYQ_'></div><div title='/raritywooo' class='G_raritywooo_'></div><div title='/ppteeth' class='G_ppteeth_'></div><div title='/ppwhat' class='G_ppwhat_'></div><div title='/gildafury' class='G_gildafury_'></div><div title='/ppchainsaw' class='G_ppchainsaw_'></div><div title='/rubysquee' class='G_rubysquee_'></div><div title='/eeveedash' class='G_eeveedash_'></div><div title='/rarizee' class='G_rarizee_'></div><div title='/applepuff' class='G_applepuff_'></div><div title='/shyduck' class='G_shyduck_'></div><div title='/twipoke' class='G_twipoke_'></div><div title='/xx00' class='G_xx00_'></div><div title='/xx10' class='G_xx10_'></div><div title='/xx20' class='G_xx20_'></div><div title='/xx30' class='G_xx30_'></div><div title='/xx01' class='G_xx01_'></div><div title='/xx11' class='G_xx11_'></div><div title='/xx21' class='G_xx21_'></div><div title='/xx31' class='G_xx31_'></div><div title='/xx02' class='G_xx02_'></div><div title='/xx12' class='G_xx12_'></div><div title='/xx22' class='G_xx22_'></div><div title='/xx32' class='G_xx32_'></div><div title='/xx03' class='G_xx03_'></div><div title='/xx13' class='G_xx13_'></div><div title='/xx23' class='G_xx23_'></div><div title='/xx33' class='G_xx33_'></div><div title='/xx04' class='G_xx04_'></div><div title='/xx14' class='G_xx14_'></div><div title='/xx24' class='G_xx24_'></div><div title='/xx34' class='G_xx34_'></div><div title='/xx05' class='G_xx05_'></div><div title='/xx15' class='G_xx15_'></div><div title='/xx25' class='G_xx25_'></div><div title='/xx35' class='G_xx35_'></div><div title='/xx06' class='G_xx06_'></div><div title='/xx16' class='G_xx16_'></div><div title='/xx26' class='G_xx26_'></div><div title='/xx36' class='G_xx36_'></div><div title='/xx07' class='G_xx07_'></div><div title='/xx17' class='G_xx17_'></div><div title='/xx27' class='G_xx27_'></div><div title='/xx37' class='G_xx37_'></div><div title='/xx08' class='G_xx08_'></div><div title='/xx18' class='G_xx18_'></div><div title='/xx28' class='G_xx28_'></div><div title='/xx38' class='G_xx38_'></div><div title='/xx09' class='G_xx09_'></div><div title='/xx19' class='G_xx19_'></div><div title='/xx29' class='G_xx29_'></div><div title='/xx39' class='G_xx39_'></div><div title='/twilight' class='G_twilight_'></div><div title='/twitrix' class='G_twitrix_'></div><div title='/trixmad' class='G_trixmad_'></div><div title='/bonbonlyra' class='G_bonbonlyra_'></div><div title='/crossfire' class='G_crossfire_'></div><div title='/lunam' class='G_lunam_'></div><div title='/mywings' class='G_mywings_'></div><div title='/yourhorn' class='G_yourhorn_'></div><div title='/twiokay' class='G_twiokay_'></div><div title='/wutpie' class='G_wutpie_'></div><div title='/wutjack' class='G_wutjack_'></div><div title='/eng' class='G_eng_'></div><div title='/what' class='G_what_'></div><div title='/twihat' class='G_twihat_'></div><div title='/heavy' class='G_heavy_'></div><div title='/hamsters' class='G_hamsters_'></div><div title='/pinkamena' class='G_pinkamena_'></div><div title='/flutterdash' class='G_flutterdash_'></div><div title='/bonbonlyra2' class='G_bonbonlyra2_'></div><div title='/brody' class='G_brody_'></div><div title='/brody2' class='G_brody2_'></div><div title='/roguedash' class='G_roguedash_'></div><div title='/roguewithit' class='G_roguewithit_'></div><div title='/dashmad' class='G_dashmad_'></div><div title='/cluna' class='G_cluna_'></div><div title='/cerealpie' class='G_cerealpie_'></div><div title='/gilda' class='G_gilda_'></div><div title='/sparklewithit' class='G_sparklewithit_'></div><div title='/dashwithit' class='G_dashwithit_'></div><div title='/shywithit' class='G_shywithit_'></div><div title='/pinkwithit' class='G_pinkwithit_'></div><div title='/jackwithit' class='G_jackwithit_'></div><div title='/rarwithit' class='G_rarwithit_'></div><div title='/derpwithit' class='G_derpwithit_'></div><div title='/discordwithit' class='G_discordwithit_'></div><div title='/hate' class='G_hate_'></div><div title='/surpriseparty' class='G_surpriseparty_'></div><div title='/spitfetish' class='G_spitfetish_'></div><div title='/hatefuck' class='G_hatefuck_'></div><div title='/twiread' class='G_twiread_'></div><div title='/wuna' class='G_wuna_'></div><div title='/ch00' class='G_ch00_'></div><div title='/ch10' class='G_ch10_'></div><div title='/ch20' class='G_ch20_'></div><div title='/ch30' class='G_ch30_'></div><div title='/ch01' class='G_ch01_'></div><div title='/ch11' class='G_ch11_'></div><div title='/ch21' class='G_ch21_'></div><div title='/ch31' class='G_ch31_'></div><div title='/ch02' class='G_ch02_'></div><div title='/ch12' class='G_ch12_'></div><div title='/ch22' class='G_ch22_'></div><div title='/ch32' class='G_ch32_'></div><div title='/ch03' class='G_ch03_'></div><div title='/ch13' class='G_ch13_'></div><div title='/ch23' class='G_ch23_'></div><div title='/ch33' class='G_ch33_'></div><div title='/ch04' class='G_ch04_'></div><div title='/ch14' class='G_ch14_'></div><div title='/ch24' class='G_ch24_'></div><div title='/ch34' class='G_ch34_'></div><div title='/ch05' class='G_ch05_'></div><div title='/ch15' class='G_ch15_'></div><div title='/ch25' class='G_ch25_'></div><div title='/ch35' class='G_ch35_'></div><div title='/ww00' class='G_ww00_'></div><div title='/ww10' class='G_ww10_'></div><div title='/ww20' class='G_ww20_'></div><div title='/ww30' class='G_ww30_'></div><div title='/ww01' class='G_ww01_'></div><div title='/ww11' class='G_ww11_'></div><div title='/ww21' class='G_ww21_'></div><div title='/ww31' class='G_ww31_'></div><div title='/ww02' class='G_ww02_'></div><div title='/ww12' class='G_ww12_'></div><div title='/ww22' class='G_ww22_'></div><div title='/ww32' class='G_ww32_'></div><div title='/fillyab' class='G_fillyab_'></div><div title='/fillyaj' class='G_fillyaj_'></div><div title='/fillybonbon' class='G_fillybonbon_'></div><div title='/fillycelestia' class='G_fillycelestia_'></div><div title='/fillycheerile' class='G_fillycheerile_'></div><div title='/fillydashready' class='G_fillydashready_'></div><div title='/fillyderpy' class='G_fillyderpy_'></div><div title='/fillydis' class='G_fillydis_'></div><div title='/fillykarma' class='G_fillykarma_'></div><div title='/fillyfluttershy' class='G_fillyfluttershy_'></div><div title='/fillyfluttershysing' class='G_fillyfluttershysing_'></div><div title='/fillyfritter' class='G_fillyfritter_'></div><div title='/fillyflirt' class='G_fillyflirt_'></div><div title='/fillyluna' class='G_fillyluna_'></div><div title='/fillylyra' class='G_fillylyra_'></div><div title='/fillyoctavia' class='G_fillyoctavia_'></div><div title='/fillypinkie' class='G_fillypinkie_'></div><div title='/fillyrd' class='G_fillyrd_'></div><div title='/fillyrose' class='G_fillyrose_'></div><div title='/fillysbstare' class='G_fillysbstare_'></div><div title='/fillyspitfire' class='G_fillyspitfire_'></div><div title='/fillystrudel' class='G_fillystrudel_'></div><div title='/fillytrixie' class='G_fillytrixie_'></div><div title='/fillytwidance' class='G_fillytwidance_'></div><div title='/fillyvinyl' class='G_fillyvinyl_'></div><div title='/rarityfilly' class='G_rarityfilly_'></div><div title='/fillydash' class='G_fillydash_'></div><div title='/lexcited' class='G_lexcited_'></div><div title='/llaugh' class='G_llaugh_'></div><div title='/lmad' class='G_lmad_'></div><div title='/lnotbad' class='G_lnotbad_'></div><div title='/lnotimpressed' class='G_lnotimpressed_'></div><div title='/lroyal' class='G_lroyal_'></div><div title='/lshady' class='G_lshady_'></div><div title='/lsquee' class='G_lsquee_'></div><div title='/lyes' class='G_lyes_'></div><div title='/ppfun' class='G_ppfun_'></div><div title='/ajfun' class='G_ajfun_'></div><div title='/rarfun' class='G_rarfun_'></div><div title='/dashfun' class='G_dashfun_'></div><div title='/twifun' class='G_twifun_'></div><div title='/shyfun' class='G_shyfun_'></div><div title='/cheerfun' class='G_cheerfun_'></div><div title='/bonfun' class='G_bonfun_'></div><div title='/lyrafun' class='G_lyrafun_'></div><div title='/derpfun' class='G_derpfun_'></div><div title='/trixfun' class='G_trixfun_'></div><div title='/rosefun' class='G_rosefun_'></div><div title='/celestiafun' class='G_celestiafun_'></div><div title='/lunafun' class='G_lunafun_'></div><div title='/faustfun' class='G_faustfun_'></div><div title='/fleurfun' class='G_fleurfun_'></div><div title='/sackfun' class='G_sackfun_'></div><div title='/carrotfun' class='G_carrotfun_'></div><div title='/abfun' class='G_abfun_'></div><div title='/sbfun' class='G_sbfun_'></div><div title='/scootafun' class='G_scootafun_'></div><div title='/braefun' class='G_braefun_'></div><div title='/speedyfun' class='G_speedyfun_'></div><div title='/thunderlanefun' class='G_thunderlanefun_'></div><div title='/esplinfun' class='G_esplinfun_'></div><div title='/parafun' class='G_parafun_'></div><div title='/artfun' class='G_artfun_'></div><div title='/bryvoodfun' class='G_bryvoodfun_'></div><div title='/dolcefun' class='G_dolcefun_'></div><div title='/orschfun' class='G_orschfun_'></div><div title='/pixelfun' class='G_pixelfun_'></div><div title='/rcrfun' class='G_rcrfun_'></div>";
			}
			if(iltbat != ""){
				emotes += "</div></div><div id='GrEmBILTBATcontainer' class='GrEmBEmoteList closedTab'><div class='GrEmBEmoteList_'>";
				emotes += "<div title='/d00' class='G_d00_'></div><div title='/d10' class='G_d10_'></div><div title='/d20' class='G_d20_'></div><div title='/d01' class='G_d01_'></div><div title='/d11' class='G_d11_'></div><div title='/d21' class='G_d21_'></div><div title='/d02' class='G_d02_'></div><div title='/d12' class='G_d12_'></div><div title='/d22' class='G_d22_'></div><div title='/d03' class='G_d03_'></div><div title='/d13' class='G_d13_'></div><div title='/d23' class='G_d23_'></div><div title='/d04' class='G_d04_'></div><div title='/d14' class='G_d14_'></div><div title='/d24' class='G_d24_'></div><div title='/d05' class='G_d05_'></div><div title='/d15' class='G_d15_'></div><div title='/d25' class='G_d25_'></div><div title='/d06' class='G_d06_'></div><div title='/d16' class='G_d16_'></div><div title='/d26' class='G_d26_'></div><div title='/d07' class='G_d07_'></div><div title='/d17' class='G_d17_'></div><div title='/d27' class='G_d27_'></div><div title='/d08' class='G_d08_'></div><div title='/d18' class='G_d18_'></div><div title='/d28' class='G_d28_'></div><div title='/d09' class='G_d09_'></div><div title='/d19' class='G_d19_'></div><div title='/d29' class='G_d29_'></div>";
			}
			emotes += "</div></div>";
			return emotes;
		}
		
		function showDebugWindow(){
			if(document.getElementById("debugWindow")){
				return;
			}
			var debugWindow = document.createElement('div');
			debugWindow.id = 'debugWindow';
			debugWindow.innerHTML = "<a href=\"#\" id='debugWindowClose' style='text-decoration: underline; font-weight: bold;'>X</a><br />Debug info: <br /><textarea style=\"width: 98%;min-height:90%;max-height:95%\">" + ((JSON.stringify(GM_safeGetValue("confArray"))).replace(/\\n/g, "\n")) + "\n\n/**Emote Names:**/\n\n" + (JSON.stringify(emoteNames).replace(/\\n/g, "\n")) + "\n\n/**Emote Names_:**/\n\n" + "</textarea>";
			document.body.appendChild(debugWindow);
			document.getElementById('debugWindowClose').addEventListener("click", hideDebugWindow);
		}
		
		function hideDebugWindow(evt){
			var dbgWin = document.getElementById("debugWindow");
			if(dbgWin){
				document.body.removeChild(dbgWin);
			}
			if(evt){
				evt.cancelBubble = true;
				evt.stopPropagation();
				evt.preventDefault()
			}
		}
		
		function incLoadedStyles(){
			loadedStyles++;
			if(window.top === window && document.body && (showNotice || window.location.host == "nallar.me")){
				var ln = document.getElementById("loadingNotice");
				if(!ln){
					var cssElem = document.createElement('div');
					cssElem.id = 'loadingNotice';
					document.body.appendChild(cssElem);
					ln = document.getElementById("loadingNotice");
				}
				delete ln.style.display;
				ln.innerHTML = "Reloading Emotes - this may take a while!";
				if(loadedStyles >= requiredStyles){
					if(doRefresh){
						window.location.reload();
					}else{
						ln.parentNode.removeChild(ln);
					}
				}
			}
		}
		
		function getEmoteNames(subs,nsfw){
			loadedStyles--;
			incLoadedStyles();
			GM_xmlhttpRequest({
				method: 'POST',
				url: "http://nallar.me/css/names.php?nsfw=" + (nsfw ? "1":"0"),
				headers: {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey nallar.me/scripts/ GrEmB',
					'Accept': 'text/plain,text/html,text/css',
					'Content-type': 'application/x-www-form-urlencoded',
				},
				onload: function (res){
					try{
						emoteNames = JSON.parse(res.responseText);
					}catch(e){
						console.log("response: " + res.responseText);
						console.log("data: subs=" + encodeURIComponent(subs));
						console.log("url: http://nallar.me/css/names.php?nsfw=" + (nsfw ? "1":"0"));
						console.log(e);
						return;
					}
					switch(emoteNames.cssKey){
						case 'generating':
							setConf('lastVersion', 1);
							setTimeout(function(){resetCache();}, 3000);
							return;
						case 'broken':
							setConf('emoteGroups', defaultConfs['emoteGroups']);
							resetCache();
							return;
					}
					setConf("cssKey", emoteNames.cssKey);
					delete(emoteNames.cssKey);
					var bl = getConf("emoteBlacklist");
					for(var i = 0; i < bl.length; i++){
						delete(emoteNames[bl[i]]);
					}
					setConf('emoteNames', emoteNames);
					return incLoadedStyles();
				},
				data: "subs=" + encodeURIComponent(subs)
			});
		}
		
		//SEE http://jsperf.com/get-text-nodes-non-recursive

		var lTime = 0;
		function convertDefaultGlobalEmotes(root){
			if(((new Date()).getTime() - lTime)<1500){
				return;
			}
			if(convTimeout){
				clearTimeout(convTimeout);
			}
			if((!goEmote&&!wkMutation)||!globalConvert||root == null|| !(/\[\]\(\/.*?\)/).test(root.innerHTML)){
				return;
			}
			goEmote = false;
			var converted = 0, maxConvert = 300, dispUn = (!doRefresh), node = root.firstChild;
			if(node == null){
				debug(100,"No firstChild? :S");
			}
			while(node != null && converted < maxConvert){
				if(node.nodeType == 3){
					var text = node;
					var v;
					while(text.nodeValue && text.parentNode.className != "GlobalEmoteAltTextDisplay_Text" && (v = emoteMatchRegExp.exec(text.nodeValue)) && v[1] && converted < maxConvert){
						var pos = v['index'];
						v[1] = v[1].toLowerCase();
						if(!v[2] && v[3]){
							v[2] = v[3];
						}
						var beforeNode = text.splitText(pos);
						beforeNode.nodeValue = beforeNode.nodeValue.replace(emoteMatchRegExp, "");
						var emoteContainerElement = document.createElement('div');
						emoteContainerElement.style.display = "inline-block";
						var emoteElement = document.createElement('a');
						emoteElement.href =  '/' + v[1];
						emoteElement.setAttribute('style', 'display: inline-block !important; float: none !important;');
						if(v[2]){
							emoteElement.title = v[2];
						}
						emoteElement.className = 'convertedEmote convertedEmote_';
						
						var emoteInfo = (/^([\-a-zA-Z0-9_]+?)(-[\-a-zA-Z0-9_]+)?$/).exec(v[1]);
						if(emoteInfo){
							if(dispUn && (!emoteNames[emoteInfo[1]])){
								emoteElement.textContent = "/" + v[1];
								emoteElement.className += " G_unknownEmote";
								if(v[1].length > 20){
									emoteElement.className += " G_largeUnknown";
								}
								if(emoteInfo[2]){
									emoteElement.href=emoteInfo[1];
								}
							}else if((/^[\-a-zA-Z0-9_]+$/).test(emoteInfo[1])){
								emoteElement.className += " G_" + emoteInfo[1] + "_";
								if(emoteInfo[2]!=undefined) emoteElement.setAttribute('href',emoteElement.getAttribute('href') + '-');
							}
						}
						emoteContainerElement.appendChild(emoteElement);
						if(v[2]){
							expandConvertedEmotes(emoteElement,emoteContainerElement);
						}
						beforeNode.parentNode.insertBefore(emoteContainerElement, beforeNode);
						text = beforeNode;
						converted++;
					}
				}
				if (node.hasChildNodes()&&!(node.tagName && noGlobalTags[node.tagName])){
					node = node.firstChild;
				} else {
					while (node.nextSibling == null){
						node = node.parentNode;
						if (node == root){
							goEmote = true;
							return;
						}
					}
					node = node.nextSibling;
				}
			}
			if(converted >= maxConvert){
				debug(106,"Converted maximum number of emotes, delaying for 2 seconds.");
				convTimeout = setTimeout(function(){var oFind = goFind; goFind = false;convertDefaultGlobalEmotes(root);goFind=oFind;},2000);
				lTime = (new Date()).getTime();
			}
			goEmote = true;
		}
		
		//START MESS OF MY CODE+ArbitraryEntity's CODE
		function expandConvertedEmotes(anchor, emoteContainerElement){
			if(!goExpand){
				return;
			}
			goExpand = false;
			if(anchor.title && !noExpandEmotes[anchor.getAttribute('href')] && anchor.className.indexOf("emoteTextExpanded") == -1){
				var altText = anchor.title;
				var theDiv = document.createElement("div");
				theDiv.className = "SuperRedditAltTextDisplay_Text";
				theDiv.setAttribute("style", "display: inline-block !important;");
				while(altText){
					linkResult = linkRegex.exec(altText)
					if(linkResult){
						theDiv.appendChild(document.createTextNode(altText.substr(0, linkResult.index)))
						var newLinkElement = document.createElement("a")
						if(linkResult[1]){
							newLinkElement.href = linkResult[0]
						} else {
							newLinkElement.href = "http://" + linkResult[0]
						}
						newLinkElement.appendChild(document.createTextNode(linkResult[0]))
						theDiv.appendChild(newLinkElement)
						altText = altText.substr(linkResult.index + linkResult[0].length)
					} else {
						theDiv.appendChild(document.createTextNode(altText))
						altText = ""
					}
				}

				var linkNextSibling = anchor.nextSibling
				emoteContainerElement.appendChild(theDiv)
				anchor.className += " emoteTextExpanded";
			}
			goExpand = true;
		}
		//END ArbitraryEntity's code!
		function fixHomePageNSFW(target){
			if(!isReddit){
				return;
			}
			var elements = target.getElementsByClassName("over18");
			for(var el in elements){
				var e = elements[el];
				if(!e.getElementsByClassName){
					continue;
				}
				if(e.getElementsByClassName('subreddit')[0] && (/mylittlepony/).test(e.getElementsByClassName('subreddit')[0].innerHTML)){
					e.getElementsByClassName('nsfw-stamp')[0].setAttribute('style', 'border: #5F99CF 1px solid !important;display: inline-block;font-size: 0px !important;letter-spacing: 0px;overflow: hidden;vertical-align: bottom;margin-bottom: -1px');
					e.getElementsByClassName('nsfw-stamp')[0].innerHTML = '';
					var v = document.createElement("div");
					v.setAttribute("style","color: #336699 !important;display: block;font-size: x-small !important;text-decoration: none;visibility: visible !important");
					v.innerHTML = "&#160;SPOILER";
					e.getElementsByClassName('nsfw-stamp')[0].appendChild(v);
					if(e.getElementsByClassName('thumbnail')[0]){
						e.getElementsByClassName('thumbnail')[0].setAttribute('style', 'background-image: url(\'http://i.imgur.com/NS6ZH.png\'); background-size: 67px 57px; background-position: 0 0;width:67px; height: 57px; background-repeat: no-repeat;');
					}
				};

			}
		}
		
		function clickBlock(evt){
				var anchor = evt.target;
				if(anchor && anchor.getAttribute('href') && anchor.innerHTML == ""){
					if(/convertedEmote_/.test(anchor.className)){
						evt.cancelBubble = true;
						evt.preventDefault();
						evt.stopPropagation();
						return false;
					}
				}
			}
			
		function youtubeInlineExpand(anchor,id,startTime){
			anchor.className += 'ytExpand';
			var ytDiv = document.createElement("div");
			ytDiv.className = "expando-button collapsed video expando-inline";
			ytDiv.setAttribute('style','vertical-align:top !important;float:none;width:23px !important;height:23px !important; max-width: 23px !important; max-height: 23px !important;display:inline-block;margin-right:6px;cursor:pointer;padding:0px');
			var videoFrame = false,br = false;
			function onClick(){
				if(ytDiv.className.indexOf('collapsed')==-1){
					ytDiv.className = 'expando-button video expando-inline collapsed';
					ytDiv.parentNode.removeChild(videoFrame);
					ytDiv.parentNode.removeChild(br);
				}else{
					if(!videoFrame){
						videoFrame = document.createElement("iframe");
						videoFrame.className = "youtube-player";
						videoFrame.width = 450;
						videoFrame.height = 366;
						videoFrame.type = "text/html";
						videoFrame.src = 'http://www.youtube.com/embed/' + id + '#t=' + startTime;
						videoFrame.frameBorder = 0;
					}
					ytDiv.parentNode.insertBefore(videoFrame,ytDiv.nextSibling);
					videoFrame.parentNode.insertBefore((br =document.createElement("br")),videoFrame);
					ytDiv.className = 'expando-button video expando-inline expanded';
				}
			};
			anchor.parentNode.insertBefore(ytDiv, anchor.nextSibling);
			ytDiv.addEventListener("click", onClick);
		}
		
		function domInsertFunction(evt){
			if(!goFind){
				return;
			}
			goFind = false;
			if(evt.target.getElementsByTagName){
				if(!isReddit){
					convertDefaultGlobalEmotes(evt.target);
				};
				var dispUn = (!doRefresh), revAlt = getConf("revealAltText"), inSub = (/\.com\/r\//).test(window.location.href), imageAlt = getConf('emoteCopy'), ytExpand = true, msgs = [];
				if(markdownConvert){
					if((/(?:^|\s)(?:md|livePreview)(?:\s|$)/i.test(evt.target.className))){
						msgs = [evt.target];
					}else{
						msgs = evt.target.getElementsByClassName("md");
					}
					for(var j = 0, len = msgs.length; j < len; j++){
						var elems = msgs[j].getElementsByTagName("A");
						for(var i = 0, len2 = elems.length; i < len2; i++){
							var emElem = elems[i];
							if((/(?:^|\s)convertedEmote(?:\s|$)/).test(emElem.className)||emElem.childNodes.length>1||(/ytExpand/).test(emElem.className)){
								continue;
							}
							if(ytExpand){
								var ytData = (/(?:https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:.*&)*v=([a-zA-Z0-9\-_]+)(?:#t=(.*)$)?|http:\/\/(?:www\.)?youtu.be\/([^\?]+))/).exec(emElem.getAttribute('href'));
								if(ytData){
									if(ytData[3]){
										youtubeInlineExpand(emElem,ytData[3],ytData[4]);
									}else{
										youtubeInlineExpand(emElem,ytData[1],ytData[2]);
									}
									continue;
								}
							}
							var hrefs = emElem.getAttribute('href');
							emElem.className += " convertedEmote";
							var hrefss = (/^(?:http\:\/\/nallar.me\/e\.php\?e\=)?\/(\/?[a-zA-Z0-9_!\%\#]+)(-[^\/]+?)?$/).exec(hrefs);
							if(!hrefss){
								continue;
							}
							var href = hrefss[1];
							emElem.className += " convertedEmote_";
							if(dispUn && (!emElem.firstChild || emElem.firstChild.nodeValue == "") && !(((/(?:^|\s)G_unknownEmote(?:\s|$)/).test(emElem.className))) && (!emoteNames[href]) && (!inSub||(emElem.clientWidth == 0&&window.getComputedStyle(emElem,':after').backgroundImage == "none" && window.getComputedStyle(emElem,':before').backgroundImage == "none"))){
								emElem.textContent = "/" + href + ((hrefss[2] != undefined) ? hrefss[2] : "");
								if(href.length > 20){
									emElem.className += " G_unknownEmote G_largeUnknown";
								}else{
									emElem.className += " G_unknownEmote";
								}
								if(hrefss[2] != undefined){
									emElem.href = "/" + href;
								}
							} else if((/^[\-a-zA-Z0-9_]+$/).test(href)){
								emElem.className += " G_" + href + "_";
								if(hrefss[2] != undefined)emElem.href = hrefs + '-';
								if(emElem.firstChild && emElem.firstChild.nodeValue == "Emote"){
									emElem.removeChild(emElem.firstChild);
									emElem.href = "/" + href + (hrefss[2] === undefined ? "" : hrefss[2] + '-');
								}
							}
							if(revAlt && emElem.title!=""){//This block is derived from ArbitraryEntity's code.
							//Get permission from ArbitraryEntity to include it if you are making a clone of this script.
							//Or, code your own replacement for it!
								var altText = emElem.title;
								var altText = emElem.title;
								var theDiv = document.createElement("div");
								theDiv.className = "SuperRedditAltTextDisplay_Text";
								if((/(?:(-in(?:p-|-|p$|$))|(?:-lalt(?:-|$)))/).test(emElem.getAttribute('href'))){
									theDiv.setAttribute("style", "display: inline-block !important;");
								}
								while(altText){
									linkResult = linkRegex.exec(altText);
									if(linkResult){
										theDiv.appendChild(document.createTextNode(altText.substr(0, linkResult.index)));
										var newLinkElement = document.createElement("a");
										if(linkResult[1]){
											newLinkElement.href = linkResult[0];
										} else {
											newLinkElement.href = "http://" + linkResult[0];
										}
										newLinkElement.appendChild(document.createTextNode(linkResult[0]));
										theDiv.appendChild(newLinkElement);
										altText = altText.substr(linkResult.index + linkResult[0].length);
									} else {
										theDiv.appendChild(document.createTextNode(altText));
										altText = "";
									}
								}
								if((/(?:-lalt(?:-|$))/).test(emElem.getAttribute('href'))){
									emElem.parentNode.insertBefore(theDiv, emElem);
									theDiv.setAttribute("style",theDiv.getAttribute("style")+"float: left !important;");
								}else{
									emElem.parentNode.insertBefore(theDiv, emElem.nextSibling);
								}
							}//End ArbitraryEntity's code
							if(imageAlt){
								var copyImage = document.createElement("img");
								copyImage.alt = "[](/" + href + ((hrefss[2] != undefined) ? hrefss[2] : "") + ' "' + emElem.title + '")';
								copyImage.style.fontSize = '0px';
								emElem.parentNode.insertBefore(copyImage,emElem);
							}
						}
					}
				}
			}
			goFind = true;
		};
		
		function initialEmotePass(){
			if(ranInitial){
				return;
			} 
			sSSection();
			ranInitial = true;
			if(isReddit&&(/reddit\.com(?:\/r\/[^\/]+?\+|\/?$)/).test(window.location.href)){
				fixHomePageNSFW(document.body);
			}
			domInsertFunction({
				target: document.body
			});
			if(getConf("defaultEmoteContainer") && (isReddit||getConf("defaultEmoteContainerEverywhere"))){
				createDefWindow();
			}
			wt += endSSection("initial conversion pass");
			var tt = endSection("Total time taken");
			debug(100,"frm: "+window.location.href+"\ttsr: "+wt+"ms\t(extern)tsl: "+(tt-wt)+"ms");
			document.body.addEventListener("click", clickBlock, false);
			if(wkMutation){
				(new wkMutation(function(mutations, observer){
					var target;
					for(var i = 0, len = mutations.length; i < len;i++){
						target = {target:mutations[i].target};
						domInsertFunction(target);
					}
				})).observe(document.body, {subtree: true, childList: true, characterData: true, attributes: !isReddit,});
			}else{
				document.body.addEventListener('DOMNodeInserted', domInsertFunction);
				document.body.addEventListener('DOMNodeInsertedIntoDocument', domInsertFunction);
			}
		};
		function createDefWindow(){
			sSSection();
			createEmoteWindow(0, getConf("defaultEmoteContainerSide") ? "left" : "right", getConf("defaultEmoteContainerX"), getConf("defaultEmoteContainerY"), (getConf("defaultEmoteContainerOnTop") || !isReddit) ? 99999 : 11, getConf("defaultEmoteContainerWidth"), getConf("defaultEmoteContainerHeight"), getDefaultEmoteHTML, getConf("smallToggler")?"":"Emotes");
			wt += endSSection("initial conversion pass");
		};
		
		
			function debug(){};
			sSection = sSSection = endSection = endSSection = function(){};
		
		
		var lastSearch = '';
		var resultSet = false;
		var emoteNamesArray = false;
		var timer = false;
		//Start emote search code
		function emoteRegChange(evt){
			setConf("emoteSearchReg",document.getElementById("emNameReg").checked);
			return true;
		}

		function findEmotesChange(evt){
			clearTimeout(timer);
			timer=setTimeout(function(){findEmotes(evt.target.value,getConf("emoteSearchReg"))},evt.keyCode == 13 ? 10 : (evt.target.value.length < 4 ? 1000 : 200));
		}
		
		function findEmotes(search, findReg, ret){
			var searchArray;
			if(emoteNamesArray === false){
				emoteNamesArray = [];
				for(var emoteName in emoteNames){
					emoteNamesArray.push(emoteName);
				}
				emoteNamesArray.sort();
			}
			if((search.indexOf(lastSearch)!=-1) && lastSearch && !findReg){
				searchArray = resultSet;
			}else{
				searchArray = emoteNamesArray;
			}
			resultSet = [];
			if(findReg){
				var cachedFindReg = new RegExp(search);
				for(var emote = 0; emote < searchArray.length; emote++){
					if(new RegExp(search).test(searchArray[emote])){
						resultSet.push(searchArray[emote]);
					}
				}
			}else{
				for(var emote = 0; emote < searchArray.length; emote++){
					if(searchArray[emote].indexOf(search) != -1){
						resultSet.push(searchArray[emote]);
					}
				}
			}
			lastSearch = search;
			if(ret){
				return resultSet;
			}
			var searchList = document.getElementById("GrEmBSearchList");
			var ihtml = "";
			for(var i = 0; i < resultSet.length; i++){
				ihtml += "<div title='/"+resultSet[i]+"' class='G_"+resultSet[i]+"_ G_small'></div>";
			}
			searchList.innerHTML = ihtml;
			ihtml = false;
			//return resultSet;
		}
		//End emote search code
		
		function resetCache(force){
			removeDefunctConfs();//No saveConf call as this does it!
			confStore["shouldReset"] = false;
			confStore["nextCacheUpdateTime"] = (new Date()).getTime()+14400000;
			confStore["lastVersion"] = localVersion;
			if(force){
				showNotice = doRefresh = true;
			}
			getEmoteNames(getSubList(),confStore["nsfwDefunctEmotes"]);
		}
		/////////////////////////////END FUNCTIONS////////////////////////////
		
		//START DYNAMIC (using above functions) VARS//
		var markdownConvert = isReddit;
		var globalConvert = !isReddit&&getConf('emoteManagerEverywhere');
		var showNotice = false;
		//END DYNAMIC VARS
		
		//Start script body!
		
		chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
			switch(request.method){
				case 'clearCssCache':
					resetCache(true);
					break;
				case 'options':
					window.location.replace("http://nallar.me/scripts/");
					break;
			}
			return false;
		});
		
		
		if(getConf("lastVersion") != localVersion){
			updateGroups();
			resetCache();
		}else if(getConf("shouldReset") || getConf("nextCacheUpdateTime") < (new Date()).getTime()){
			resetCache();
		} else if((/allconfreset=1/).test(window.location.href)){
			confStore = {};
			removeDefunctConfs();
			saveConf();
			window.location.replace(window.location.href.replace(/allconfreset=1/g, ""));
		}
		
		if(window.top === window){
			properOnLoadEvent_(function(){setTimeout(addConf,300);});
		}
		
		
		
		var emoteNames = getConf('emoteNames');
		if((emoteNames instanceof Array)){
			emoteNames = defaultConfs['emoteNames'];
		}
		
		if(isReddit||globalConvert||getConf("defaultEmoteContainerEverywhere")){
			loadStyleSheet(mainStylesheet + getConf("cssKey") + "&nsfw=" + (getConf("nsfwDefunctEmotes")?"1":"0"), true);
		}
		
		if(true){
			if((/\/r\/MLPLounge/i).test(window.location.href)){
				cssStore += ('code{font-family: monospace !important;} ');
			}
			cssStore += ('#GrEmBSearchList div{float: none !important;display: inline-block !important;clear:none;}.G_small{max-width:95% !important; max-height: 300px !important;} .convertedEmote_{cursor: default;padding: 0 0 0 0 !important;margin: 0 0 0 0 !important; border-radius: 0px !important;clear:none;float:left;display:block}.closedWindow{visibility: hidden !important;}.closedTab{display: none !important;}.GrEmBEmoteList_{overflow-y: scroll !important; overflow-x: hidden; height: ' + (getConf("defaultEmoteContainerHeight") - 39) + 'px;width: ' + (getConf("defaultEmoteContainerWidth") - 2) + 'px;} .GrEmBEmoteList_ div{cursor: pointer;} .G_unknownEmote{font-family: monospace; font-size: small !important;word-break:break-all;word-wrap:break-word;color:rgb(255,255,255) !important;cursor:text !important;background-color:rgb(105,105,120) !important;display:block;clear:none;float:left;width:50px;height:50px;}.G_largeUnknown{width:70px;height:70px;}.GrEmBTitleText{font-size: 12.5pt; font-weight: bold;}.SuperRedditAltTextDisplay_Text {color: gray !important; word-break:break-all;word-wrap:break-word;} .SuperRedditAltTextDisplay_Text a {color: gray !important; text-decoration:underline !important;}.GlobalEmoteAltTextDisplay_Text {color: gray; word-wrap: break-word; display:inline-block}.GlobalEmoteAltTextDisplay_Text a {color: gray; text-decoration:underline; display:inline-block}.G_spoiler_:hover{background:#000; color: #fff;}.G_spoiler_::after{content: "" !important;}');
			if(isReddit||getConf('emoteManagerEverywhere')){
				cssStore += ("a.convertedEmote_[href*='-r-']{-moz-transform:scaleX(-1);-webkit-transform:scaleX(-1);-o-transform:scaleX(-1);}a.convertedEmote_[href*='-blink!']{text-decoration:blink !important}a.convertedEmote_[href*='-comicsans!']{font-family:'Comic-Sans MS',cursive}.convertedEmote_[href*='-impact!']{font-family:Impact,Charcoal,sans-serif}a.convertedEmote_[href*='-tahoma!']{font-family:Tahoma,Geneva,sans-serif}a.convertedEmote_:hover[href*='-r-'][href*='-d-'],a.convertedEmote_:hover[href*='-r-'][href*='-d-']{-moz-transform:rotate(0deg)scaleX(1);-o-transform:rotate(0deg)scaleX(1);-webkit-transform:rotate(0deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-45-'],a.convertedEmote_:hover[href*='-45-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(45deg)scaleX(1);-o-transform:rotate(45deg)scaleX(1);-webkit-transform:rotate(45deg)scaleX(1)}a.convertedEmote_[href*='-90-'],a.convertedEmote_:hover[href*='-90-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(90deg)scaleX(1);-o-transform:rotate(90deg)scaleX(1);-webkit-transform:rotate(90deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-135-'],a.convertedEmote_:hover[href*='-135-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(135deg)scaleX(1);-o-transform:rotate(135deg)scaleX(1);-webkit-transform:rotate(135deg)scaleX(1);}a.convertedEmote_[href*='-180-'],a.convertedEmote_:hover[href*='-180-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(180deg)scaleX(1);-o-transform:rotate(180deg)scaleX(1);-webkit-transform:rotate(180deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-225-'],a.convertedEmote_:hover[href*='-225-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(225deg)scaleX(1);-webkit-transform:rotate(225deg)scaleX(1);-o-transform:rotate(225deg)scaleX(1);}a.convertedEmote_[href*='-270-'],a.convertedEmote_:hover[href*='-270-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(270deg)scaleX(1);-o-transform:rotate(270deg)scaleX(1);-webkit-transform:rotate(270deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-315-'],a.convertedEmote_:hover[href*='-315-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(315deg)scaleX(1);-o-transform:rotate(315deg)scaleX(1);-webkit-transform:rotate(315deg)scaleX(1);}a.convertedEmote_[href*='-r-'],a.convertedEmote_:hover[href*='-d-'],a.convertedEmote_:hover[href*='-dancer-']{-moz-transform:rotate(0deg)scaleX(-1);-o-transform:rotate(0deg)scaleX(-1);-webkit-transform:rotate(0deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-45-'][href*='-r-'],a.convertedEmote_:hover[href*='-45-'][href*='-d-']{-moz-transform:rotate(45deg)scaleX(-1);-o-transform:rotate(45deg)scaleX(-1);-webkit-transform:rotate(45deg)scaleX(-1)}a.convertedEmote_[href*='-90-'][href*='-r-'],a.convertedEmote_:hover[href*='-90-'][href*='-d-']{-moz-transform:rotate(90deg)scaleX(-1);-o-transform:rotate(90deg)scaleX(-1);-webkit-transform:rotate(90deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-135-'][href*='-r-'],a.convertedEmote_:hover[href*='-135-'][href*='-d-']{-moz-transform:rotate(135deg)scaleX(-1);-webkit-transform:rotate(135deg)scaleX(-1);-o-transform:rotate(135deg)scaleX(-1);}a.convertedEmote_[href*='-180-'][href*='-r-'],a.convertedEmote_:hover[href*='-180-'][href*='-d-']{-moz-transform:rotate(180deg)scaleX(-1);-o-transform:rotate(180deg)scaleX(-1);-webkit-transform:rotate(180deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-225-'][href*='-r-'],a.convertedEmote_:hover[href*='-225-'][href*='-d-']{-moz-transform:rotate(225deg)scaleX(-1);-o-transform:rotate(225deg)scaleX(-1);-webkit-transform:rotate(225deg)scaleX(-1);}a.convertedEmote_[href*='-270-'][href*='-r-'],a.convertedEmote_:hover[href*='-270-'][href*='-d-']{-moz-transform:rotate(270deg)scaleX(-1);-o-transform:rotate(270deg)scaleX(-1);-webkit-transform:rotate(270deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-315-'][href*='-r-'],a.convertedEmote_:hover[href*='-315-'][href*='-d-']{-moz-transform:rotate(315deg)scaleX(-1);-o-transform:rotate(315deg)scaleX(-1);-webkit-transform:rotate(315deg)scaleX(-1);}a.convertedEmote_[href*='-225-'][href*='-f-'][href*='-r-'],a.convertedEmote_:hover[href*='-225-'][href*='-f-'][href*='-d-']{-moz-transform:rotate(45deg)scaleX(1);-webkit-transform:rotate(45deg)scaleX(1);-o-transform:rotate(45deg)scaleX(1)}a.convertedEmote_[href*='-270-'][href*='-f-'][href*='-r-'],a.convertedEmote_:hover[href*='-270-'][href*='-f-'][href*='-d-']{-moz-transform:rotate(90deg)scaleX(1);-webkit-transform:rotate(90deg)scaleX(1);-o-transform:rotate(90deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-315-'][href*='-f-'][href*='-r-'],a.convertedEmote_:hover[href*='-315-'][href*='-f-'][href*='-d-']{-moz-transform:rotate(135deg)scaleX(1);-webkit-transform:rotate(135deg)scaleX(1);-o-transform:rotate(135deg)scaleX(1)}a.convertedEmote_[href*='-f-'][href*='-r-'],a.convertedEmote_:hover[href*='-f-'][href*='-d-']{-moz-transform:rotate(180deg)scaleX(1);-webkit-transform:rotate(180deg)scaleX(1);-o-transform:rotate(180deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-45-'][href*='-f-'][href*='-r-'],a.convertedEmote_:hover[href*='-45-'][href*='-f-'][href*='-d-']{-moz-transform:rotate(225deg)scaleX(1);-webkit-transform:rotate(225deg)scaleX(1);-o-transform:rotate(225deg)scaleX(1)}a.convertedEmote_[href*='-90-'][href*='-f-'][href*='-r-'],a.convertedEmote_:hover[href*='-90-'][href*='-f-'][href*='-d-']{-moz-transform:rotate(270deg)scaleX(1);-webkit-transform:rotate(270deg)scaleX(1);-o-transform:rotate(270deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-135-'][href*='-f-'][href*='-r-'],a.convertedEmote_:hover[href*='-135-'][href*='-f-'][href*='-d-']{-moz-transform:rotate(315deg)scaleX(1);-webkit-transform:rotate(315deg)scaleX(1);-o-transform:rotate(315deg)scaleX(1)}a.convertedEmote_[href*='-225-'][href*='-f-'],a.convertedEmote_:hover[href*='-225-'][href*='-f-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(45deg)scaleX(-1);-webkit-transform:rotate(45deg)scaleX(-1);-o-transform:rotate(45deg)scaleX(-1)}a.convertedEmote_[href*='-270-'][href*='-f-'],a.convertedEmote_:hover[href*='-270-'][href*='-f-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(90deg)scaleX(-1);-webkit-transform:rotate(90deg)scaleX(-1);-o-transform:rotate(90deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-315-'][href*='-f-'],a.convertedEmote_:hover[href*='-315-'][href*='-f-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(135deg)scaleX(-1);-webkit-transform:rotate(135deg)scaleX(-1);-o-transform:rotate(135deg)scaleX(-1)}a.convertedEmote_[href*='-f-'],a.convertedEmote_[href*='-fuckingcrazy-'],a.convertedEmote_:hover[href*='-f-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(180deg)scaleX(-1);-o-transform:rotate(180deg)scaleX(-1);-webkit-transform:rotate(180deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-45-'][href*='-f-'],a.convertedEmote_:hover[href*='-45-'][href*='-f-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(225deg)scaleX(-1);-o-transform:rotate(225deg)scaleX(-1);-webkit-transform:rotate(225deg)scaleX(-1)}a.convertedEmote_[href*='-90-'][href*='-f-'],a.convertedEmote_:hover[href*='-90-'][href*='-f-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(270deg)scaleX(-1);-o-transform:rotate(270deg)scaleX(-1);-webkit-transform:rotate(270deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-135-'][href*='-f-'],a.convertedEmote_:hover[href*='-135-'][href*='-f-'][href*='-r-'][href*='-d-']{-moz-transform:rotate(315deg)scaleX(-1);-o-transform:rotate(315deg)scaleX(-1);-webkit-transform:rotate(315deg)scaleX(-1)}a.convertedEmote_:hover[href*='-rd-']{-moz-transform:rotate(0deg)scaleX(1);-o-transform:rotate(0deg)scaleX(1);-webkit-transform:rotate(0deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-90d-'],a.convertedEmote_:hover[href*='-90rd-']{-moz-transform:rotate(90deg)scaleX(1);-o-transform:rotate(90deg)scaleX(1);-webkit-transform:rotate(90deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-180d-'],a.convertedEmote_:hover[href*='-fd-']{-moz-transform:rotate(180deg)scaleX(1);-o-transform:rotate(180deg)scaleX(1);-webkit-transform:rotate(180deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-270d-'],a.convertedEmote_:hover[href*='-270rd-']{-moz-transform:rotate(270deg)scaleX(1);-o-transform:rotate(270deg)scaleX(1);-webkit-transform:rotate(270deg)scaleX(1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-rd-']{-moz-transform:rotate(0deg)scaleX(-1);-o-transform:rotate(0deg)scaleX(-1);-webkit-transform:rotate(0deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-90r-'],a.convertedEmote_[href*='-90rd-'],a.convertedEmote_:hover[href*='-90d-']{-moz-transform:rotate(90deg)scaleX(-1);-o-transform:rotate(90deg)scaleX(-1);-webkit-transform:rotate(90deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-fd-'],a.convertedEmote_:hover[href*='-180d-']{-moz-transform:rotate(180deg)scaleX(-1);-o-transform:rotate(180deg)scaleX(-1);-webkit-transform:rotate(180deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href*='-270r-'],a.convertedEmote_[href*='-270rd-'],a.convertedEmote_:hover[href*='-270d-']{-moz-transform:rotate(270deg)scaleX(-1);-o-transform:rotate(270deg)scaleX(-1);-webkit-transform:rotate(270deg)scaleX(-1);image-rendering:-moz-crisp-edges;}a.convertedEmote_[href='/sp']{display: inline-block !important;padding-right: 100% !important;float: none !important;}");
			}

			if(!getConf("disableEmoteSpin")&&(isReddit||getConf('emoteManagerEverywhere'))){
				cssStore += ('a.convertedEmote_[href*=-spin-],  a.convertedEmote_[href*=-spin-]{ -moz-transform-style: flat; -moz-animation: spin 2s infinite ease; -moz-transform: translateZ(-360px) rotateX(360deg); -webkit-transform-style: flat; -webkit-animation: spin 2s infinite ease; -webkit-transform: translateZ(-360px) rotateX(360deg);}a.convertedEmote_[href*=-ispin-], a.convertedEmote_[href*=-ispin-] { -moz-transform-style: flat; -moz-animation: ispin 2s infinite linear; -moz-transform: translateZ(-360px) rotateX(360deg); -webkit-transform-style: flat; -webkit-animation: ispin 2s infinite linear; -webkit-transform: translateZ(-360px) rotateX(360deg);} a.convertedEmote_[href*=-yspin-] {-moz-transform: translateZ(50px); -moz-transform-style: flat; -moz-animation: yspin 2s infinite linear; -webkit-transform: translateZ(50px); -webkit-transform-style: flat; -webkit-animation: yspin 2s infinite linear;} a.convertedEmote_[href*=-xspin-] {-moz-transform-style: flat; -moz-transform: rotateX(0deg); -moz-animation: xspin 2s infinite ease; -webkit-transform: rotateX(0deg); -webkit-transform-style: flat; -webkit-animation: xspin 2s infinite ease;}a.convertedEmote_[href*=-rotate-], a.convertedEmote_[href*=-rotate-] { -moz-transform-style: flat; -moz-animation: rotate 2s infinite ease; -moz-transform: translateZ(0px) rotateX(0deg); -webkit-transform-style: flat; -webkit-animation: rotate 2s infinite ease;}a.convertedEmote_[href*=-rrotate-] { -moz-transform-style: flat; -moz-animation: rrotate 2s infinite ease; -moz-transform: translateZ(0px) rotateX(0deg); -webkit-transform-style: flat; -webkit-animation: rotater 2s infinite ease;}a.convertedEmote_[href*=-lrotate-] { -moz-transform-style: flat; -moz-animation: lrotate 2s infinite linear; -moz-transform: translateZ(0px) rotateX(0deg); -webkit-transform-style: flat; -webkit-animation: rotatel 2s infinite linear;}a.convertedEmote_[href*=-lrrotate-] { -moz-transform-style: flat; -moz-animation: lrrotate 2s infinite linear; -moz-transform: translateZ(0px) rotateX(0deg); -webkit-transform-style: flat; -webkit-animation: rotatelr 2s infinite linear;}@-moz-keyframes xspin { from { -moz-transform: rotateX(0deg);} to { -moz-transform: rotateX(360deg); } }@-webkit-keyframes spin { from { -webkit-transform: rotateY(0) translateZ(0px) rotateX(0deg);} to {-webkit-transform: rotateY(360deg) translateZ(100px) rotateX(360deg); } }@-webkit-keyframes ispin { from { -webkit-transform: rotateY(0) translateZ(0px) rotateX(0deg);} to { -webkit-transform: rotateY(360deg) translateZ(100px) rotateX(360deg); } }@-moz-keyframes spin { from { -moz-transform: rotateY(0) translateZ(0px) rotateX(0deg);} to {-moz-transform: rotateY(360deg) translateZ(100px) rotateX(360deg); } }@-webkit-keyframes xspin { from { -webkit-transform: rotateX(0deg);} to { -webkit-transform: rotateX(360deg); } }@-moz-keyframes ispin { from { -moz-transform: rotateY(0) translateZ(0px) rotateX(0deg);} to { -moz-transform: rotateY(360deg) translateZ(100px) rotateX(360deg); } }@-webkit-keyframes yspin { from { -webkit-transform: rotateY(0)} to { -webkit-transform: rotateY(360deg);} }@-moz-keyframes yspin { from { -moz-transform: rotateY(0)} to { -moz-transform: rotateY(360deg);} }@-moz-keyframes rotate { from { -moz-transform: rotate(0deg);} to {-moz-transform: rotate(360deg); } }@-moz-keyframes rrotate { from { -moz-transform: rotate(0deg);} to {-moz-transform: rotate(-360deg); } }@-moz-keyframes lrotate { from { -moz-transform: rotate(0deg);} to {-moz-transform: rotate(360deg); } }@-moz-keyframes lrrotate { from { -moz-transform: rotate(0deg);} to {-moz-transform: rotate(-360deg); } }@-webkit-keyframes rotate { from { -webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(360deg); } }@-webkit-keyframes rotater { from { -webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(-360deg); } }@-webkit-keyframes rotatel { from { -webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(360deg); } }@-webkit-keyframes rotatelr { from { -webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(-360deg); } } @-moz-keyframes zspin{from{-moz-transform:rotate(0deg)scaleX(1)rotatez(0deg)}to{-moz-transform:rotate(0deg)scaleX(1)rotatez(360deg)}}@-webkit-keyframes zspin{from{-webkit-transform:rotate(0deg)scaleX(1)rotatez(0deg)}to{-webkit-transform:rotate(0deg)scaleX(1)rotatez(360deg)}} a.convertedEmote_[href*="-zspin-"]{-moz-animation:zspin 2s infinite linear;-webkit-animation:zspin 2s infinite linear;image-rendering:-moz-crisp-edges}');
			}
			cssStore += ("a.convertedEmote_[href*='-i-']{ -o-filter: hue-rotate(180deg) !important; filter: hue-rotate(180deg) !important; -webkit-filter: hue-rotate(180deg) !important;} a.convertedEmote_[href*='-inp-'], a.convertedEmote_[href*='-in-']{ float: none !important; display: inline-block !important;}");
			
			cssStore += ('a.convertedEmote_[href="/sbf"], a.convertedEmote_[href="/rsbf"] {display: block; clear:none; float:left; background-image: url(http://i.imgur.com/baE1o.png); width: 80px; height: 66px;}');

			var redditSize = (getConf("wideReddit") ? 'max-width: none !important; width: auto !important;' : '');
			cssStore += ('.commentNavSortType{display: inline-block !important;} .comment .md{overflow-y: hidden !important; ' + redditSize + '} .livePreview{'+redditSize+'} #loadingNotice {text-align: center; font-size: 30px;width: 500px;top:50px; margin: 0 auto; position: fixed;border: 1px solid blue; background-color: white; margin-top: 36px; z-index: 9999999999;left: 75%;margin-left: -250px;}#debugWindow {top: 5%;width: 80%;height: 90%;margin: 0 auto; position: fixed;border: 1px solid blue; background-color: white; z-index: 9999999999;left: 10%;} #editGroupWindow,#editBlacklistWindow {top: 35%;width: 30%;height: 30%;margin: 0 auto; position: fixed;border: 1px solid blue; background-color: white; z-index: 9999999999;left: 35%;} .G_b {display: inline-block;zoom: 1;color: white;border-radius: 3px;padding: 3px;display: block;float: left;margin: 5px 7px 0 0px;background-color: whiteSmoke;border: 1px solid #DEDEDE;border-top: 1px solid #EEE;border-left: 1px solid #EEE;vertical-align: middle;font-family: "Lucida Grande", Tahoma, Arial, Verdana, sans-serif;font-size: 12px;text-decoration: none;font-weight: bold;color: #565656;cursor: pointer;padding: 5px 10px 6px 7px;}.G_b:hover{background-color: #D1D1F1;color: #0E0E0E !important;}.G_Ce{cursor: pointer; color: blue; font-size: 18px !important; font-weight: bold;}#G_manageSubs td, #G_manageSubs tr, #G_manageSubs th{line-height:13px!important;padding: 2px !important;}#G_manageSubs td a{cursor: pointer; color: blue;}.GrEmBWindow{height: auto !important; width: auto !important;' + getConf("emoteManagerWindowStyle") + "}\n\n"); //This is last so that broken user styles do not break the rest of the CSS.
		}
		showCSS();
		wt += endSSection("Added styles and initialised");
		properOnLoadEvent_(initialEmotePass);
	};

function loadStyleSheet(filename,override){
	var fileref = document.createElement("link");
	fileref.rel = "stylesheet";
	fileref.type = "text/css";
	fileref.href = filename;
	fileref.async = true;
	if(override){
		document.head.appendChild(fileref);
	}else{
		document.head.insertBefore(fileref, document.head.firstChild);
	}
}

function properOnLoadEvent(cb){
	if(document.readyState === "complete" && document.getElementsByTagName("head")[0]){
		cb();
	} else {
		/*document.addEventListener("DOMContentLoaded", function (){
			if((document.readyState === "complete") && document.getElementsByTagName("head")[0]){
				cb();
			}
		}, false);*/
		document.addEventListener("readystatechange", function (){
			if((document.readyState === "complete") && document.getElementsByTagName("head")[0]){
				cb();
			}
		}, false);
	}
}

function properOnLoadEvent_(cb){
	if((document.readyState === "complete" || document.readyState === "interactive") && document.getElementsByTagName("head")[0]){
		cb();
	} else {
		/*document.addEventListener("DOMContentLoaded", function (){
			if((document.readyState === "complete" || document.readyState === "interactive") && document.getElementsByTagName("head")[0]){
				cb();
			}
		}, false);*/
		document.addEventListener("readystatechange", function (){
			if((document.readyState === "complete" || document.readyState === "interactive") && document.getElementsByTagName("head")[0]){
				cb();
			}
		}, false);
	}
}

function properOnLoadEvent__(cb){
	if(document.getElementsByTagName("head")[0]){
		cb();
	} else {
		/*document.addEventListener("DOMContentLoaded", function (){
			if(document.getElementsByTagName("head")[0]){
				cb();
			}
		}, false);*/
		document.addEventListener("readystatechange", function (){
			if(document.getElementsByTagName("head")[0]){
				cb();
			}
		}, false);
	}
}

function fakeTimeout(callback){
	if(window.top === window){
		properOnLoadEvent__(callback);
		return;
	}
	properOnLoadEvent__(function(){
	document.head.addEventListener("timeoutEvent", function (){
		properOnLoadEvent__(callback);
	}, false);
	var ev = document.createEvent("HTMLEvents");
	ev.initEvent("timeoutEvent", true, false);
	document.head.dispatchEvent(ev);});
}

if(!ranPassFunction){
	var runScript = function(){fakeTimeout(passFunction);}
	chrome.extension.sendMessage({method: "getConf"},function(response){if(response.data){confStore = response.data;} runScript();});
}