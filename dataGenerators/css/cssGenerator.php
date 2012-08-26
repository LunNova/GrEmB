<?php

sleep(5);

chdir("/srv/www/nallar.me/css/");

require "cssEmoteParser.php";

$count["subs"] = 0;
$count["fails"] = 0;

$subss["other"] = Array("minecraft", "fffffffuuuuuuuuuuuu", "homestuck");
$subss["other_nsfw"] = Array();
$subss["main"] = Array("map.css", "mylittlesh", "mlas1party", "mylittleanhero23", "cuttershy", "gremotes", "pankakke", "mylittlesports", "molestia", "flitter", "ilovedashie", "applebloom", "seriouslyluna", "mylittlefoodmanes", "gallopfrey", "mylittleanime", "mylittleaprilfools", "dashiemotes", "lyra", "tbpimagedump", "mylittlealcoholic", "mlplounge", "mylittleserver", "minuette", "twilightsparkle", "mylittlewarhammer", "ainbowdash", "mylittledamon", "mylittlekindle", "octavia", "pinkiepie", "mylittlewtf", "mylittlenanners", "mylittlewelcomewagon", "mylittlenosleep", "mlpdrawingschool", "mylittledaww", "mylittlemusician", "surprise", "mylittlelistentothis", "applejack", "mylittlecelestias", "mylittlefortress", "roseluck", "mlhfis", "falloutequestria", "mylittlelivestream", "mlas1animotes", "daylightemotes", "mylittlesquidward", "vinylscratch", "mylittlenopenopenope", "thebestpony", "mylittleandysonic1", "idliketobeatree", "mylittlebannertest", "mylittlechaos", "mylittlesupportgroup", "speedingturtle", "mylittlecirclejerk", "mylittleonions", "mylittlecombiners", "mylittlepony");
$subss["main_nsfw"] = Array("mylittlechaos", "mylittlebannertest", "futemotes", "ponyanarchism", "spaceclop", "clopclop", "nsfwgremotes", "mylittlecombiners", "mylittlepony");

$css = Array();

function getStyle($name){
	if(stripos($name,".css") !== false){
		return file_get_contents($name);
	}
	return file_get_contents("http://reddit.com/r/$name/stylesheet.css?v=".rand(1,9999999));
}

foreach($subss as $subsss){
	foreach($subsss as $sub){
		if(!isset($css[$sub])){
			$css[$sub] = getStyle($sub);
			echo ".";
			$count["subs"]++;
		} 
		sleep(6);
	}
}

echo "\n";

$fails = Array();

foreach($css as $sub => $data){
	$i = 0;
	echo ".";
	while(!$data && (++$i < 6)){
		$count["fails"]++;
		sleep($i * 24);
		if(!@$css[$sub])$css[$sub] = getStyle($sub);
		echo "\e[0;35m.";
	}
	if($i){
		echo "\e[00m";
		$fails[] = "\e[00m$sub failed $i times.";
	}
	
	$cT = new cssEmoteParser();
	$cT->parseString($css[$sub],$sub,true);
	$cT->finalize();
	$css[$sub]=$cT->toString();
	if(!file_put_contents("subs/$sub.min.css", $css[$sub])){
		$fails[] = "Failed to write to subs/$sub.min.css";
	}
	file_put_contents("subs/$sub.count", $cT->emoteCount);
}

echo implode("\n",$fails) . "\n";

unset($subsss);
unset($sub);
unset($k);
unset($data);
unset($cT);
unset($i);

echo "Retrieved " . $count["subs"] . " subs, failed " . $count["fails"] . " times.\n";



foreach($subss as $k => $subs){
	$cT = new cssEmoteParser();
	if(stripos($k, "_nsfw")===false){
		$cT->nsfw = Array("cock", "dick", "jizz", "/fut", "dashurbate");
	}
	foreach($subs as $s){
		$cT->parseString($css[$s],$s);
	}
	$cT->finalize();
	if($cT->emoteCount > 0){
		file_put_contents("$k.min.css", $cT->toString());
		file_put_contents("$k.count", $cT->emoteCount);
	}
}
?>