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
			generator: function(tab){
				return settings.defaultGenerator(tab) + "<div align='right' id='manageSubs'></div>";
			},
			settings: {
				//IF !extension
				internalUpdateCheck: {
					description: "Use built-in update checker?",
					help: "The script can automatically check for updates. With Scriptish, this is unnecessary as it does it automatically.",
					children:{
						updateCheckWeekly: {
							description: "Check for updates weekly",
							help: "Increases the time from daily to weekly, to reduce the frequency of update notices which may be annoying.",
						}
					}
				},
				//ENDIF
				wideReddit:{
					description: "Make reddit comments use the full width",
					help: "reddit normally limits comments not to use the full width of the screen. Some emotes are quite wide, and turning this on will allow them to fit",
				},
				revealAltText:{
					description: "Show hover text",
					help: "Shows hover text next to emotes, so you do not have to mouse over to check for it. This also allows you to hover over an emote to see the subreddit it's from",
				},
				emoteManagerEverywhere:{
					description: "Globally display emotes",
					help: "Displays reddit emotes on all websites.",
				},
				//IF !extension
				emoteCopy:{
					description: "Make emotes copy and paste correctly.",
					help: "This allows you to copy and paste from reddit without having to look at the source to get the emote codes",
				},
				//ENDIF
				disableEmoteSpin:{
					description: "Disable 3D emote animations",
					help: "3D emote animations can result in slowdowns, so this allows you to disable them."
				},
				defaultEmoteContainer: {
					description: "Enable emote browser",
					help: "A window which lets you easily find emotes",
					children:{
						defaultEmoteContainerEverywhere:{
							description: "Enable emote browser globally",
							help: "globally = all websites"
						},
						defaultEmoteContainerOnTop:{
							description: "Display emote browser icon under reddit header",
							help: "Makes the emote browser toggler button only show up after scrolling down when on reddit",
						},
						defaultEmoteContainerMouseLeave:{
							description: "Close the emote browser if you move the mouse away",
						},
						_emoteContainerAuto:{
							description: "Automatically open the emote browser",
							help: "Opens the emote browser for you when you start typing in a textarea/form, and closes it when you are done."
						},
						defaultEmoteContainerSide:{
							description: "Toggler icon side",
							type: 'radio',
							help: "Sets the side of the screen the icon used to open the emote browser is displayed on.",
							radio1: "Left ",
							radio2: "Right ",
						},
						smallToggler:{
							description: "Use small toggler",
							help: "Removes the word 'emotes' from the toggler, to make it smaller.",
						},
						emoteManagerWindowStyleType:{
							description: "Use easy emotes style emote browser",
							help: "By disabling this, you can use a custom CSS style",
							negatedChildren: true,
							children: {
								emoteManagerWindowStyle:{
									description: "",
									help: "",
									type: "text",
								}
							}
						}
					}
				},
			},
			onUpdate: function(){
				manageSubs();
			}
		}
	},
	
	defaultGenerator: function(tab){
		function makeHtml(settingsList,space){
			var rHTML = "";
			for(var s in settingsList){
				if(settingsList[s].type == "radio"){
					rHTML += space + settings.makeInput(s, "radio1", settingsList[s].radio1) + settings.makeInput(s, "radio2", settingsList[s].radio2) + " " + settingsList[s].description + (settingsList[s].help ? ("<a class='G_help'>?</a><div><div>" + settingsList[s].help + "</div></div>") : "")+"<br />";
				}else{
					rHTML += space + settings.makeInput(s, settingsList[s].type) + " " + settingsList[s].description + (settingsList[s].help ? ("<a class='G_help'>?</a><div><div>" + settingsList[s].help + "</div></div>") : "")+"<br />";
				}
				if(confStore[s] === (settingsList[s].negatedChildren?false:true) && settingsList[s].children){
					rHTML += makeHtml(settingsList[s].children, space + "&#160;&#160;") + "<br />";
				}
			}
			return rHTML;
		}
		return "<form action='#' name='settingsForm' id='settingsForm'>" + makeHtml(tab.settings, "") + "</form>";
	},
	
	makeInput: function(id, type, q){
		if(defaultConfs[id] === undefined){
			debug(103, "makeInput(): Hmm... this id isn't in defaultConfs, something is wrong :( " + id);
		}
		q = q?q:'';
		switch(type){
			case 'text':
				return '<input class="G_input" id="' + id + '" name="conf" value="' + confStore[id] + '" type="textarea" ' + '"/>';
			case 'radio2':
				return q + '<input class="G_input" id="' + id + '" name="conf" value="right" type="radio"' + boolToChecked(!confStore[id]) + '/>';
			case 'radio1':
				return q + '<input class="G_input" id="' + id + '" name="conf" value="right" type="radio"' + boolToChecked(confStore[id]) + '/>';
			default:
				return '<input class="G_input" id="' + id + '" name="conf" value="' + id + '" type="checkbox"' + boolToChecked(confStore[id]) + '/>';
		}
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
		var generatedHTML = (tab.generator ? tab.generator : settings.defaultGenerator)(tab);
		if(generatedHTML === false){//indicates that there's no change necessary
			return;
		}
		settings.elem.innerHTML = generatedHTML;
		if(tab.onUpdate){
			tab.onUpdate();
		}
		settingsForm = document.getElementById('settingsForm');
		settingsForm.addEventListener("change", settings.onChange);
		settings.lastTab = tab;
	},
	
	update: function(){
		settings.showTab(settings.lastTab);
	},
	
	onChange: function(){
		var oconf = cloneObject(confStore), refreshPage = false;
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
			confStore.emoteManagerWindowStyle = defaultConfs["emoteManagerWindowStyle"];
		}
		if(!compareObjects(confStore, oconf)){
			saveConf();
			settings.update();
		}
	},
};