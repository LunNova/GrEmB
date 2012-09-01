<?php
if(!@$_GET['key'] || $_GET['key']==" ") die();
$key = @preg_replace("/[^a-zA-Z0-9_\-\.]/","",$_GET['key']);
$t = microtime(true);
$subs = @explode(",",file_get_contents("keys/$key.key")); 
$nsfw = array_pop($subs)==="nsfw=1";
$key = md5(implode(",",$subs).",nsfw=".($nsfw?"1":"0"));
$d = @file_get_contents("cache/$key.css");
if(!$d){
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
	header("Cache-Control: no-store, no-cache, must-revalidate"); 
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
	die("/*not yet generated!*/");
}
header("Content-type: text/css");
header("Expires: " . gmdate("D, d M Y H:i:s", time() + 14400) . " GMT");
header("Pragma: cache");
header("Cache-Control: max-age=14400");
echo $d;
?>