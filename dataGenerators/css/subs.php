<?php

$subs = "/r/mylittleandysonic1, /r/mylittlewtf, /r/MLAS1animotes, /r/MyLittlePony, /r/idliketobeatree, /r/mylittlesquidward, /r/daylightemotes, /r/mylittledaww, /r/mylittlenanners, /r/vinylscratch, /r/applejack, /r/mylittleonions, /r/MyLittleNopeNopeNope, /r/MyLittleLivestream, /r/MyLittleBannerTest, /r/MLHFIS, /r/mylittledamon, /r/MyLittleNoSleep, /r/roseluck, /r/thebestpony, /r/tbpimagedump, /r/mylittlecelestias, /r/MyLittleChaos, /r/MyLittleMusician, /r/Surprise, /r/PinkiePie, /r/TwilightSparkle, /r/ainbowdash, /r/MyLittleWarHammer, /r/mylittlealcoholic, /r/MyLittleSupportGroup, /r/SpeedingTurtle, /r/mylittlecirclejerk, /r/Flitter, /r/Molestia, /r/MyLittleSports, /r/SeriouslyLuna, /r/FalloutEquestria, /r/ILoveDashie, /r/Applebloom, /r/MLPDrawingSchool, /r/MyLittleWelcomeWagon, /r/GallopFrey, /r/MyLittleAnime, /r/MyLittleFoodManes, /r/MyLittleKindle, /r/MyLittleServer";
$subs = strtolower($subs);
$subs = str_replace(" ","",$subs);
$subs = str_replace("/r/","",$subs);
$subs = explode(",",$subs);
$subs = "'".implode("','",$subs)."'";
echo $subs;