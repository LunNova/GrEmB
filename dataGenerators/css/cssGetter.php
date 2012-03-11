<?php

if(@$argv[1] == "nsfw"){
	$backup = "nsfw.min.css";
	$css = file_get_contents("http://reddit.com/r/futemotes/stylesheet.css");
}else{
	$backup = @$ARGV[2]?:"out4.min.css";
	$css = file_get_contents($argv[1]?:"temp.css");
}
if(!$css){
	readfile($backup);
	die();
}
preg_match_all('/a\[href[\^\|]?=[\'"]\/[^}]+}/', $css, $ret);
$emotes = $ret[0];

echo implode("\n",$emotes);
?>