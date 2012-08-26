use warnings;
use strict;
use List::MoreUtils qw/ uniq /;

my @subs = uniq("mylittlechaos", "mylittlebannertest", "futemotes", "ponyanarchism", "spaceclop", "clopclop", "nsfwgremotes", "mylittlecombiners", "mylittlepony", "gremotes", "pankakke", "mylittlesports", "molestia", "flitter", "ilovedashie", "applebloom", "seriouslyluna", "mylittlefoodmanes", "gallopfrey", "mylittleanime", "mylittleaprilfools", "dashiemotes", "lyra", "tbpimagedump", "mylittlealcoholic", "mlplounge", "mylittleserver", "minuette", "twilightsparkle", "mylittlewarhammer", "ainbowdash", "mylittledamon", "mylittlekindle", "octavia", "pinkiepie", "mylittlewtf", "mylittlenanners", "mylittlewelcomewagon", "mylittlenosleep", "mlpdrawingschool", "mylittledaww", "mylittlemusician", "surprise", "mylittlelistentothis", "applejack", "mylittlecelestias", "mylittlefortress", "roseluck", "mlhfis", "falloutequestria", "mylittlelivestream", "mlas1animotes", "daylightemotes", "mylittlesquidward", "vinylscratch", "mylittlenopenopenope", "thebestpony", "mylittleandysonic1", "idliketobeatree", "mylittlebannertest", "mylittlechaos", "mylittlesupportgroup", "speedingturtle", "mylittlecirclejerk", "mylittleonions", "mylittlecombiners", "mylittlepony");
my @compareSubs = uniq('ainbowdash', 'futemotes', 'mlpdrawingschool', 'mylittlecelestias', 'mylittlelivestream', 'mylittlesports', 'roseluck', 'applebloom', 'gallopfrey', 'mlplounge', 'mylittlechaos', 'mylittlemusician', 'mylittlesquidward', 'seriouslyluna', 'applejack', 'idliketobeatree', 'molestia', 'mylittlecirclejerk', 'mylittlenanners', 'mylittlesupportgroup', 'spaceclop', 'clopclop', 'ilovedashie', 'mylittlealcoholic', 'mylittledamon', 'mylittlenopenopenope', 'mylittlewarhammer', 'speedingturtle', 'cuttershy', 'lyra', 'mylittleandysonic1', 'mylittledaww', 'mylittlenosleep', 'mylittlewelcomewagon', 'surprise', 'dashiemotes', 'minuette', 'mylittleanhero23', 'mylittlefoodmanes', 'mylittleonions', 'mylittlewtf', 'tbpimagedump', 'daylightemotes', 'mlas1animotes', 'mylittleanime', 'mylittlefortress', 'mylittlepony', 'pankakke', 'thebestpony', 'falloutequestria', 'mlas1party', 'mylittleaprilfools', 'mylittlekindle', 'mylittleserver', 'pinkiepie', 'twilightsparkle', 'flitter', 'mlhfis', 'mylittlebannertest', 'mylittlelistentothis', 'mylittlesh', 'ponyanarchism', 'vinylscratch');

my @t;
@t = @compareSubs;
@compareSubs = @subs;
@subs = @t;
#(@compareSubs, @subs) = (@subs, @compareSubs);

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