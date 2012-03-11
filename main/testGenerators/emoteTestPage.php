<?php
require "../includes/cssmin-v3.0.1-minified.php";
$files = Array("out4.min.css", "nsfw.min.css");
foreach($files as $file){
	$c = CssMin::minify(file_get_contents($file));
	preg_match_all("/a\[href[\$\*\^|]?=['\"]\/([^'\"]+?)['\"]\]/",$c,$ret);
	$emotes = $ret[1];
	preg_match_all("/\.G_([^{ \,]+?)_/",$c,$ret);
	$emotes = array_unique(array_merge($emotes, $ret[1]));
	$out = "";
	foreach($emotes as $e){
		$out .= "<a href='/$e' emoteID='$e' class='G_{$e}_'></a>";
	}
	$fh = fopen($n = ('../tests/'.substr($file,0,(stripos($file,".")?:strlen($file))))."t.html", "w");
	echo "Wrote $n\n<br />";
	fwrite($fh, $out);
	fclose($fh);
}
?>