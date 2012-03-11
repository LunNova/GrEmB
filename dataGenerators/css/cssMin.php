<?php
require "cssmin-v3.0.1-minified.php";
$file = @$argv[1]?:die("Must supply input file");
$bkFile = @$argv[2]?:die("Must supply backup file.");
$c = CssMin::minify(file_get_contents($file));
$c = str_replace("a[href=","a[href|=",$c);
$emotes_=preg_match_all("/a\[href.?=['\"]\/([^'\"]+?)['\"]\]/",$c,$ret);
$emotes = count(array_unique($ret[1]));

if(@$argv[3]){
	$emlist = implode(",",$ret[1]);
	file_put_contents("emotelist.txt",$emlist);
	unset($emlist);
}
preg_match_all("/a\[href[\^|]?=['\"]\/([^'\"]+?)['\"]\]/",$c,$ret);
foreach($ret[1] as $k=>$v){
	$newName = preg_match("/^[\-a-zA-Z0-9_]+$/",$v);
	if($newName === 0 || $newName === false){
		continue;
	}
	$c = preg_replace("/a\[href[\^|]?=['\"]\/".preg_quote($v)."['\"]\]/",".G_{$v}_",$c);
}
preg_match_all("/a\:hover\[href[\^|]?=['\"]\/([^'\"]+?)['\"]\]/",$c,$ret);
foreach($ret[1] as $k=>$v){
	$newName = preg_match("/^[\-a-zA-Z0-9_]+$/",$v);
	if($newName === 0 || $newName === false){
		continue;
	}
	$c = preg_replace("/a\:hover\[href[\^|]?=['\"]\/".preg_quote($v)."['\"]\]/",".G_{$v}_:hover",$c);
}
$c = str_replace('"monospace"',"monospace",$c);
if($bkFile!="other.min.css"){
$c = str_replace('.G_blank_',".G_bblank_",$c);
}
$c = str_replace('-140px0px',"-140px 0px",$c);
$c = str_replace('a[href',".md a[href",$c);
$c = str_replace('a:hover[href',".md a:hover[href",$c);
$c = preg_replace('/\s?\!important([^\'"])/','\\1',$c);
if($emotes > 0){
	echo "/*Parsed $emotes emote-names, using $emotes_ selectors/classes. Generated at ".time()." */ ";
	echo $c;
	if($argv[4]){
		readfile("combine.css");
	}
	die();
}
echo "/*Failed to parse emotes at ".time().", reusing old.*/ \n";
if(!@readfile($bkFile)){
	echo "\n/* Failed to reuse old. Brilliant. */.body::after{content: 'yay, GrEmB broke. Check if there\\'s an update or something, PM nallar or go to /r/GrEmB'; position: absolute; top: 20px; left:50%;}\n";
}
?>