settings = {
	unconfigureableProperties: {
		"alwaysTrue": 1,
	},
	tabs:{
		advanced: {generator: function(){
			var iHTML = "<form action='#' name='settingsForm' id='settingsForm'>";
			var ids = [];
			for(var id in confStore){
				ids.push(id);
			}
			ids.sort();
			for(var i = 0; i < ids.length; i++){
				id = ids[i];
				if(uncloneableProperties[id] || settings.unconfigureableProperties[id] || typeof confStore[id] === "object"){
					continue;
				}
				iHTML += settings.makeInput(id, (typeof confStore[id]==="boolean")?"checkbox":"text") + " " + id +"<br />";
			}
			iHTML += "</form>";
			return iHTML;
		}},
		main: {
			settings: {
				//IF !extension
				internalUpdateCheck: {
					description: "Use built-in update checker?",
					children:{
						updateCheckWeekly: {
							description: "Use built-in update checker?",
						}
					}
				},
				//ENDIF
				defaultEmoteContainer: {
					description: "Enable emote browser",
					children:{
						
					}
				}
			},
			gen_erator: function(){
				if(unsupported){
					superBundlePrefs.innerHTML = "<span style='text-color: red; text-style: bold;'>For some reason we can't seem to save configuration data - did you remember to install TamperMonkey if you're using Chrome? Make sure you did, remove this script from your extensions, and install it again, making sure to click ok when it asks you if you want to install it with TamperMonkey.</span><br />";
					return;
				}
				var dis = {'all':'','E':'','F':'','G':'','S':'','T': '','WK':' disabled=\'disabled\''};

				if(!getConf("defaultEmoteContainer")){
					dis.E = true;
				}
				if(!getConf("emoteManagerEverywhere")){
					dis.F = dis.G = true;
				}
				if(getConf("emoteManagerWindowStyleType")){
					dis.S = true;
				}
				if(getConf("_emoteContainerAuto")){
					dis.T = true;
				}
				if(isWebKit){
					dis.WK = true;
				}
				oldDis = dis;
				var prefHTML = "<form action='#' name='settingsForm' id='settingsForm'>";
				//IF !extension
				prefHTML += 'Use script update checker?(set to off if you have GM/TM correctly configured for updating)' + settings.makeInput('internalUpdateCheck', 'checkbox', dis.all);
				prefHTML += '<br />&#160;&#160;Check for updates weekly instead of every day?' + settings.makeInput('updateCheckWeekly', 'checkbox', dis.all) + '<br /><br />';
				//ENDIF
				prefHTML += 'Include Emote Window/Search?' + settings.makeInput('defaultEmoteContainer', 'checkbox', dis.all);
				prefHTML += '<br />&#160;&#160;Display emote window everywhere instead of just reddit?' + settings.makeInput('defaultEmoteContainerEverywhere', 'checkbox', dis.E);
				prefHTML += '<br />&#160;&#160;Display emote window on top of reddit header?' + settings.makeInput('defaultEmoteContainerOnTop', 'checkbox', dis.E);
				prefHTML += '<br />&#160;&#160;Close the emote window when your mouse leaves it?' + settings.makeInput('defaultEmoteContainerMouseLeave', 'checkbox', dis.E);
				prefHTML += '<br />&#160;&#160;Open emote window automatically when a text box is selected?' + settings.makeInput('_emoteContainerAuto', 'checkbox', dis.E);
				prefHTML += (getConf('_emoteContainerAuto')?'':'<br />&#160;&#160;Which side of the screen should the toggler be displayed on?' + settings.makeInput('defaultEmoteContainerSide', 'radio2', dis.E, "Right:") + settings.makeInput('defaultEmoteContainerSide', 'radio1', dis.E, "Left:"));
				prefHTML += settings.makeInput('defaultEmoteContainerMLAS1', 'checkbox', dis.E) + '&#160;&#160;Include r/mylittleandysonic1 emotes? <br />' ;
				prefHTML += '<br />&#160;&#160;Include r/idliketobeatree emotes?' + settings.makeInput('defaultEmoteContainerILTBAT', 'checkbox', dis.E);
				prefHTML += '<br />&#160;&#160;Use small emote window toggler?' + settings.makeInput('smallToggler', 'checkbox', dis.E);
				prefHTML += '<br />&#160;&#160;Use Easy Emotes style emote window?' + settings.makeInput('emoteManagerWindowStyleType', 'checkbox', dis.E) + (getConf("emoteManagerWindowStyleType")?'':('<br />&#160;&#160;&#160;&#160;What custom CSS style should be used?' + settings.makeInput('emoteManagerWindowStyle', 'text', (dis.E || dis.S))));
				prefHTML += '<br /><br />Wide reddit - comments as wide as your screen will allow, so some large emotes can fit' + settings.makeInput('wideReddit', 'checkbox', dis.all);
				prefHTML += '<br />Show hover text?' + settings.makeInput('revealAltText', 'checkbox', dis.all);
				prefHTML += '<br />Show emotes on all websites?' + settings.makeInput('emoteManagerEverywhere', 'checkbox', dis.all);
				if(isFF){
					prefHTML += '<br />&#160;&#160;Make copy-paste include emote text' + settings.makeInput("emoteCopy", "checkbox", dis.all);
				}
				prefHTML += '<br /><b>Disable spinning/3D emotes?</b> (recommended unless you have a fast computer)' + settings.makeInput('disableEmoteSpin', 'checkbox', dis.all);
				prefHTML += '<br /><input id="saveSubmit" name="conf" type="submit" value="save"' + dis.all + '/>' + "</form>";
				return prefHTML;
			},
			onDisplay: function(){
				manageSubs();
			}
		}
	},
	
	defaultGenerator: function(tab){
		var iHTML = "<form action='#' name='settingsForm' id='settingsForm'>";
		function makeHtml(settingsList,space){
			var rHTML = "";
			for(var s in settingsList){
				rHTML += space + settings.makeInput(s, settingsList[s].type) + settingsList[s].description + "<br />";
				if(confStore[s] === true && settingsList[s].children){
					rHTML += makeHtml(settingsList[s].children, space + "&#160;&#160;");
				}
			}
			return rHTML;
		}
		iHTML += makeHtml(tab.settings, "");
		iHTML += "<div align='right' id='manageSubs'></div></form>";
		return iHTML;
	},
	
	makeInput: function(id, type, dis, q){
		if(defaultConfs[id] === undefined){
			debug(103, "makeInput(): Hmm... this id isn't in defaultConfs, something is wrong :( " + id);
		}
		if(!q){
			q = '';
		}
		dis = dis ? " disabled='disabled'" : "";
		if(type == 'text'){
			return '<span><input class="G_input" id="' + id + '" name="conf" value="' + confStore[id] + '" type="textarea" ' + dis + '"/></span>';
		}
		if(type == 'radio2'){
			return '<span>' + q + '<input class="G_input" id="' + id + '" name="conf" value="right" type="radio" ' + getConfForm2(id) + dis + '/></span>';
		}
		if(type == 'radio1'){
			return '<span>' + q + '<input class="G_input" id="' + id + '" name="conf" value="left" type="radio" ' + getConfForm(id) + dis + '/></span>';
		}
		return '<span><input class="G_input" id="' + id + '" name="conf" value="' + id + '" type="checkbox" ' + getConfForm(id) + dis + '/></span>';
	},
	
	init: function(){
		settings.elem = document.getElementById('G_ConfAnchor');
		document.getElementById('G_ConfTabs').addEventListener("click", function(evt){
			settings.showTab(evt.target.innerHTML.toLowerCase());
			evt.preventDefault();
			return false;
		});
		settings.showTab("main");
	},
	
	showTab: function(tab){
		if(typeof tab === 'string' && !(tab = settings.tabs[tab])){
			return;
		}
		settings.elem.innerHTML = (tab.generator ? tab.generator : settings.defaultGenerator)(tab);
		if(tab.onDisplay){
			tab.onDisplay();
		}
		settingsForm = document.getElementById('settingsForm');
		settingsForm.addEventListener("change", settings.onChange);
		settings.lastTab = tab;
	},
	
	update: function(){
		settings.showTab(settings.lastTab);
	},
	
	onChange: function(){
		var oconf = cloneObject(confStore),refreshPage = false;
		for(var i = 0, e; i < settingsForm.elements.length; i++){
			e = settingsForm.elements[i];
			if(e.className != "G_input"){
				continue;
			}
			if(e.checked !== undefined && e.type === "checkbox"){
				confStore[e.id] = e.checked;
			} else if(e.type.substr(0, 4) === "text"){
				confStore[e.id] = e.value;
			} else if(e.type === "radio"){
				if(e.checked){
					confStore[e.id] = (e.value === "left");
				}
			}
			if(typeof confStore[e.id] === 'string' && /^[0-9\.]+$/.test(confStore[e.id])){
				confStore[e.id] = +confStore[e.id];
			}
		}
		if(getConf("emoteManagerWindowStyleType")){
			confStore["emoteManagerWindowStyle"] = defaultConfs["emoteManagerWindowStyle"];
		}
		if(!compareObjects(confStore, oconf)){
			saveConf();
			settings.update();
		}
	},
};