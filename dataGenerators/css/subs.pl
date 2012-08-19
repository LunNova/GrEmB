use warnings;
use strict;

my @subs = ("mylittlesports","molestia","flitter","ilovedashie","applebloom","seriouslyluna","mylittlefoodmanes","gallopfrey","mylittleanime","mylittleaprilfools","dashiemotes","lyra","tbpimagedump","mylittlealcoholic","mlplounge","mylittleserver","minuette","twilightsparkle","mylittlewarhammer","ainbowdash","mylittledamon","mylittlekindle", "octavia", "pinkiepie","mylittlewtf","mylittlenanners","mylittlewelcomewagon", "mylittlenosleep", "mylittleonions", "mlpdrawingschool", "mylittledaww", "mylittlemusician", "surprise", "mylittlelistentothis","applejack", "mylittlecelestias","mylittlefortress", "roseluck", "mlhfis", "falloutequestria", "mylittlelivestream", "mlas1animotes", "daylightemotes", "mylittlesquidward", "vinylscratch", "mylittlenopenopenope","thebestpony","mylittleandysonic1","idliketobeatree","mylittlepony", "mylittlebannertest", "mylittlechaos", "mylittlesupportgroup", "speedingturtle", "mylittlecirclejerk");
my @compareSubs = ('mylittleandysonic1','mylittlewtf','mlas1animotes','mylittlepony','idliketobeatree','mylittlesquidward','daylightemotes','mylittledaww','mylittlenanners','vinylscratch','applejack','mylittleonions','mylittlenopenopenope','mylittlelivestream','mylittlebannertest','mlhfis','mylittledamon','mylittlenosleep','roseluck','thebestpony','tbpimagedump','mylittlecelestias','mylittlechaos','mylittlemusician','surprise','pinkiepie','twilightsparkle','ainbowdash','mylittlewarhammer','mylittlealcoholic','mylittlesupportgroup','speedingturtle','mylittlecirclejerk','flitter','molestia','mylittlesports','seriouslyluna','falloutequestria','ilovedashie','applebloom','mlpdrawingschool','mylittlewelcomewagon','gallopfrey','mylittleanime','mylittlefoodmanes','mylittlekindle','mylittleserver');

@compareSubs = map {lc($_)} @compareSubs;
@subs = map {lc($_)} @subs;
my %pSubs = map { $_ => 1 } @compareSubs;
print STDERR "Missing";
for my $csub(@subs){
	$csub = lc($csub);
	if(!exists($pSubs{$csub})){
		print STDERR "\"$csub\", ";
	}
}
print STDERR "\n";