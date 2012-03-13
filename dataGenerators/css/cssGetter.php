<?php
if(@$argv[1] == "nsfw"){
	$backup = "nsfw.min.css";
	$css = file_get_contents("http://reddit.com/r/futemotes/stylesheet.css");
}else{
	$backup = @$ARGV[2]?:"out4.min.css";
	$css = file_get_contents("temp.css");
}
if(!$css){
	sleep(60);
	$css = file_get_contents("http://reddit.com/r/futemotes/stylesheet.css");
}
if(!$css){
	readfile($backup);
	die();
}

$css = preg_replace('/\/\*.+?\*\//','',$css);

$emotes = Array();
if(preg_match_all('/a\[href[\^\|]?=[\'"]\/[^}]+}/', $css, $ret))
	$emotes = array_merge($emotes,$ret[0]);
if(preg_match_all('/a\:hover\[href[\^\|]?=[\'"]\/[^}]+}/', $css, $ret))
	$emotes = array_merge($emotes,$ret[0]);
if(preg_match_all('/a\:\:hover\[href[\^\|]?=[\'"]\/[^}]+}/', $css, $ret))
	$emotes = array_merge($emotes,$ret[0]);

if(empty($emotes)){
	readfile($backup);
	die();
}
	
echo implode("\n",array_unique($emotes));
?>