<?php
require "cssEmoteParser.php";

$times = Array();
$lastPrint = "";

function cTime($thing, $seconds){
	global $times;
	if(@$times[$thing] < time()){
		$times[$thing] = time() + $seconds;
		return true;
	}
	return false;
}

function keyToInfo($key){
	$subs = @explode(",",file_get_contents("keys/$key.key"));
	$nsfw = array_pop($subs)==="nsfw=1";
	return Array($subs, $nsfw);
}

function updateCSSAndNames($key){
	global $lastPrint;
	$lastPrint = "group";
	$sTime = microtime(true);
	list($subs, $nsfw) = keyToInfo($key);
	$cT = new cssEmoteParser();
	if(!$nsfw){
		$cT->nsfw = array_merge($cT->nsfw,Array("horsecock", "dick", "jizz", "dashurbate"));
	}
	foreach($subs as &$s){
		$d = @file_get_contents("subs/$s.min.css");
		if(!$d){
			file_put_contents("subs/$s.min.css","/*Not yet retrieved from queue.*/");
			touch("subs/$s.min.css", time()-1900, time()-1900);
		}
		$cT->parseString($d,$s,false,false);
	}
	$cT->finalize();
	$d = $cT->getEmoteNames($key);
	file_put_contents("cache/$key.name", $d);
	file_put_contents("cache/$key.css", "");
	file_put_contents("cache/$key.css", $cT->toString());
	echo "\nUpdated $key: ".count($subs)." subs, nsfw=".$nsfw."\tTime: ".(microtime(true)-$sTime)."";
}

function getDatedKey(){
	clearstatcache(true);
	clearstatcache(false);
	$a = glob("keys/*.key");
	foreach($a as $k => &$aa){
		$aa = str_replace(array("keys/",".key"),"",$aa);
		if(@filemtime("cache/$aa.css") + 1800 < time()&&filemtime("keys/$aa.key") + 18000 > time()){
			return $aa;
		}
	}
}

function getStyle($name){
	if(stripos($name,".css") !== false){
		return file_get_contents($name);
	}
	$data = @file_get_contents("http://reddit.com/r/$name/stylesheet.css?v=".rand(1,9999999));
	return $data;
}

function updateSub($sub){
	global $lastPrint;
	if($lastPrint != "sub"){
		echo "\nUpdated $sub";
	}else{
		echo ", $sub";
	}
	$lastPrint = "sub";
	$css = getStyle($sub);
	if(!$css){
		touch("subs/$sub.min.css");
		return;
	}
	file_put_contents("cachedsubs/$sub.css",$css);
	
	$cT = new cssEmoteParser();
	$cT->parseString($css,$sub,true);
	$cT->finalize();
	$d = $cT->toString();
	if(!$d && file_exists("subs/$sub.min.css")){
		unlink("subs/$sub.min.css");
		$lastPrint = "delete";
		echo "\nDeleted $sub - empty!";
		return;
	}
	file_put_contents("subs/$sub.min.css", $d);
	file_put_contents("subs/$sub.count", $cT->emoteCount);
	
}

function getDatedSub(){
	clearstatcache(true);
	clearstatcache(false);
	$a = glob("subs/*.min.css");
	foreach($a as $k => &$aa){
		$aa = str_replace(array("subs/",".min.css"),"",$aa);
		if($aa != "map.css" && @filemtime("subs/$aa.min.css") + 1800 < time()){
			return $aa;
		}
	}
}

while(1){
	if(cTime('cache', 8)){
		$key = getDatedKey();
		if($key)updateCSSAndNames($key);
	}else if(cTime('subs', 6)){
		$sub = getDatedSub();
		if($sub)updateSub($sub);
	}
	sleep(1);
}
?>