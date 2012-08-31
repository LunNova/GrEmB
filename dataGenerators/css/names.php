<?php
$groups = explode(",",@$_GET['groups']);
$names = "";
foreach($groups as &$g){
	$g = preg_replace("/[^a-zA-Z0-9_-]/","",$g);
	$names .= file_get_contents($g.".names")."\n";
}
$names = array_unique(explode("\n",$names));
natsort($names);
unset($names[array_search("",$names)?:"/^/^/^/^/^/^"]);
echo str_replace(",\n\"}","}",'{"' . implode("\": 1,\n\"",$names) . '": 1}');
?>