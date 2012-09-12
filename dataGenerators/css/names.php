<?php
if(@$_GET['subs'])$_POST['subs'] = $_GET['subs'];
if(!@$_POST['subs']) die();
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$subs = explode(",",@$_POST['subs']);
foreach($subs as $kk => &$s){
	$s = preg_replace("/[^a-zA-Z0-9_\-\.]/","",$s);
	if(strlen($s) <= 1){
		unset($subs[$kk]);
	}
}
function unique_order($a){
	foreach($a as $k => $aa){
		if(max(array_keys($a, $aa, true)) != $k){
			unset($a[$k]);
		}
	}
	return array_values($a);
}
$subs = unique_order($subs);
if(count($subs) < 1){
	//die();
	die('{"cssKey": "broken"}');
}
$nsfw = @$_GET['nsfw'] === '1';
$compact = implode(",",$subs).",nsfw=".($nsfw?"1":"0");
$key = md5($compact);
$d = @file_get_contents("cache/$key.name");
touch("keys/$key.key");
file_put_contents("keys/$key.key", $compact);
if($d){
	echo $d;
	die();
}
die('{"cssKey": "generating"}');
require "cssEmoteParser.php";
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
$d = $cT->getEmoteNames($key);
echo $d;
file_put_contents("cache/$key.name", $d);
?>