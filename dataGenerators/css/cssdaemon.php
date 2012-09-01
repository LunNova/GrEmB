<?php
require "cssEmoteParser.php";

function keyToInfo($key){
	$subs = @explode(",",file_get_contents("keys/$key.key"));
	$nsfw = array_pop($subs)==="nsfw=1";
	return Array($subs, $nsfw);
}

function updateCSSAndNames($key){
	list($subs, $nsfw) = keyToInfo($key);
	echo "Updating $key: ".count($subs)." subs, nsfw=".$nsfw."\n";
	$cT = new cssEmoteParser();
	if(!$nsfw){
		$cT->nsfw = array_merge($cT->nsfw,Array("horsecock", "dick", "jizz", "dashurbate"));
	}
	foreach($subs as &$s){
		$d = @file_get_contents("subs/$s.min.css");
		if(!$d){
			file_put_contents("subs/$s.min.css","/*Not yet retrieved from queue.*/");
		}
		$cT->parseString($d,$s,false,false);
	}
	$cT->finalize();
	$d = (str_replace(", \"}","}",'{"cssKey": "' . $key . "\", \"" . implode("\": 1, \"",$cT->getEmoteNames()) . '": 1}'));
	file_put_contents("cache/$key.name", $d);
	file_put_contents("cache/$key.css", $cT->toString());
}

function getDatedKey(){
	$a = glob("keys/*.key");
	foreach($a as $k => &$aa){
		$aa = str_replace(array("keys/",".key"),"",$aa);
		if(@filemtime("cache/$aa.css") + 1800 < time()){
			return $aa;
		}
	}
}

while(1){
	$key = getDatedKey();
	if($key)updateCSSAndNames($key);
	else echo "no keys!";
	sleep(15);
}
?>