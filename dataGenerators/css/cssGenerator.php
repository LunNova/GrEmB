<?php

$cached = false;
if(stripos(implode(" ",@$argv)." ","-c ")!==false){
	$cached = true;
}


chdir("/srv/www/nallar.me/css/");

require "cssEmoteParser.php";

$count["subs"] = 0;
$count["fails"] = 0;

$subss["other"] = Array("minecraft", "fffffffuuuuuuuuuuuu", "homestuck");
$subss["other_nsfw"] = Array();
$subss["main"] = Array("map.css", "mylittletacos", "tacoshy", "mylittlesh", "mlas1party", "mylittleanhero23", "cuttershy", "gremotes", "pankakke", "mylittlesports", "molestia", "flitter", "ilovedashie", "applebloom", "seriouslyluna", "mylittlefoodmanes", "gallopfrey", "mylittleanime", "mylittleaprilfools", "dashiemotes", "lyra", "tbpimagedump", "mylittlealcoholic", "mlplounge", "mylittleserver", "minuette", "twilightsparkle", "mylittlewarhammer", "ainbowdash", "mylittledamon", "mylittlekindle", "octavia", "pinkiepie", "mylittlewtf", "mylittlenanners", "mylittlewelcomewagon", "mylittlenosleep", "mlpdrawingschool", "mylittledaww", "mylittlemusician", "surprise", "mylittlelistentothis", "applejack", "mylittlecelestias", "mylittlefortress", "roseluck", "mlhfis", "falloutequestria", "mylittlelivestream", "mlas1animotes", "daylightemotes", "mylittlesquidward", "vinylscratch", "mylittlenopenopenope", "thebestpony", "mylittleandysonic1", "mlas1emotes", "mlas1imagedump", "idliketobeatree", "mylittlebannertest", "mylittlechaos", "mylittlesupportgroup", "speedingturtle", "mylittlecirclejerk", "mylittleonions", "mylittlecombiners", "mylittlepony");
$subss["main_nsfw"] = Array("mylittlechaos", "mylittlebannertest", "futemotes", "ponyanarchism", "spaceclop", "clopclop", "nsfwgremotes", "mylittlecombiners", "mylittlepony");

$noCompress = Array("_mylittlecombiners");

$css = Array();

foreach($subss as $subsss){
	foreach($subsss as $sub){
		if(!@$css[$sub])$css[$sub]=file_get_contents("subs/$sub.min.css");
	}
}

unset($subsss);
unset($sub);
unset($k);
unset($data);
unset($cT);
unset($i);

echo "Retrieved " . $count["subs"] . " subs, failed " . $count["fails"] . " times.\n";

$nsfwMin = Array();

foreach($subss as $k => $subs){
	$cT = new cssEmoteParser();
	if(stripos($k, "_nsfw")===false){
		$cT->nsfw = array_merge($cT->nsfw,Array("horsecock", "dick", "jizz", "dashurbate"));
	}else if(isset($nsfwMin[$k])){
		$cT->emotePriorities = $nsfwMin[$k];
	}else{
		echo "$k had no clean names!\n";
	}
	foreach($subs as $s){
		$cT->parseString($css[$s],$s,false,in_array($s, $noCompress));
	}
	$cT->finalize();
	if($cT->emoteCount > 0){
		file_put_contents("$k.min.css", 'body::after{content:"Your GrEmB is out of date, or you have multiple versions installed. Please go to http://nallar.me/scripts/ and update it!"; width: 400px; display:block; height: 40px; background-color: white; position: fixed; left:20px; top: 100px; border: 1px solid #E1B000;}'.$cT->toString());
		file_put_contents("$k.names", implode("\n",$cT->getEmoteNames(false,true)));
		file_put_contents("unstable/$k.min.css", $cT->toString());
		file_put_contents("$k.count", $cT->emoteCount);
		if(isset($subss[$k."_nsfw"])){
			$nsfwMin[$k."_nsfw"] = Array();
			foreach($cT->emotePriorities as $ek => $ignored){
				$nsfwMin[$k."_nsfw"][$ek] = 999;
			}
		}
	}
	echo "Done $k with {$cT->emoteCount} emotes.\n";
	sleep(60);
	continue;
	$cT = new cssEmoteParser();
	$cT->gremb = false;
	if(stripos($k, "_nsfw")===false){
		$cT->nsfw = array_merge($cT->nsfw,Array("horsecock", "dick", "jizz", "dashurbate"));
	}else if(isset($nsfwMin[$k])){
		$cT->emotePriorities = $nsfwMin[$k];
	}
	foreach($subs as $s){
		$cT->parseString(@file_get_contents("cachedsubs/$s.css"),$s,true,in_array($s, $noCompress));
	}
	$cT->finalize();
	if($cT->emoteCount > 0){
		file_put_contents("$k.style.css", $cT->toString());
	}
}
?>