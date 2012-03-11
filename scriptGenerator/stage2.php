<?php
if(!@$_GET){
	$type = $ARGV[2];
	$inputFile = $ARGV[1];
	$dataDir = @$ARGV[3]?:'data';
	$frames = @$ARGV[4]?true:false;
}
else{
	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
	header("Content-Type: text/javascript; charset=utf-8");
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
}
$new = false;
function check_version(&$d,$t){
	global $v,$new;
	if(preg_match('/\@version\s+?([0-9\.]+)/',$d,$ret)){
		global $tt;
		$tt = $t;
		$v = $ret[1];
		$lv = @file_get_contents("old/$t.v");
		if($lv != md5($d)){
			@file_put_contents("old/$t.v",md5($d));
			return $new = true;
		}
	}
	return false;
}
$d = file_get_contents("GrEmB.user.js");
check_version($d,$type);

$a = array(
	'rmlp.html',
	'rmlas1.html',
	'rmlas1nsfw.html',
	'riltbat.html',
);
$b = array();
$c = array();
foreach($a as $sub){
	$b[] = "/*" . $sub . "*/";
	$temp = trim(file_get_contents("$datadir/".$sub));
	if($sub != "nsfw.css"){
		$temp = str_replace("<br />","",$temp);
		$temp = str_replace(Array("<a ","/>"),Array("<tag style='cursor: pointer !important;'","></tag>"),$temp);
		$temp = str_replace("<tempbr / >","<br />",$temp);
	}
	$c[] = $temp;
}
$d = str_replace($b,$c,$d);
$d = str_replace('103/*REPLACE*/',(($type=='unstable')?98:103),$d);
if($new){
	$i = 0;
	while(file_exists("old/{$tt}_{$v}_$i.js"))$i++;
	file_put_contents("old/{$tt}_{$v}_$i.js",$d);
	file_put_contents("old/{$tt}_{$v}_$i.user.js",$d);
}
if($frames){
	$d = str_replace('document-start', 'document-end', $d);
}
echo $d;
?>
