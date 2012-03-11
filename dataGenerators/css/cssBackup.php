<?php
$pre = "_main";
$dir = "oldcss/";
for($i = 1;$i <= 18;$i++){
	$files["$dir$i$pre.css"] = @filemtime("$dir$i$pre.css");
}
asort($files,SORT_NUMERIC);
foreach($files as $k=>$f){
	file_put_contents("$k",file_get_contents("out4.min.css"));
	//sleep(2);
	die();
}