use lib '/usr/local/lib/perl5/site_perl/5.15.4/';
use lib '/usr/local/lib/perl5/site_perl/';
use lib '/usr/local/lib/perl5/site_perl/5.15.4/x86_64-linux-ld/';
use strict;
use warnings;
use CSS;
use LWP::Simple;
use Data::Dumper;

my $reddit = 0;
if($reddit){
	use Reddit;
}

my $css = "";
my $cssObj = CSS->new( { 'parser' => 'CSS::Parse::Lite' } );
my @subs;
if(defined $ARGV[0]&&$ARGV[0] eq "other"){
	@subs = ("homestuck","minecraft","fffffffuuuuuuuuuuuu");
}else{
	open(SUBLIST,'../includes/subs.list')
	my $data = join('',<SUBLIST>);
	my $data =~ s/"//;
	my @subs = split(/,/,$data);
}
my $pdupe = 0;
my $sleep = 0;

foreach my $sub(@subs){
	if($sleep){
		sleep(6);
	}
	$sleep = 1;
	my $data = get("http://reddit.com/r/$sub/stylesheet.css?r=".rand(1000));
	if(!$data){
		print STDERR "Failed $sub!";
		exit(0);
	}
	#$data =~ s/(\r\n|\r|\n)/\n/g;
	$data =~ s/(?:\s+)?\/\*(.*?)\*\/(?:\s+)?//gs;
	$data =~ s/START-PONYSCRIPT-IGNORE\s?\{(.+?)END-PONYSCRIPT-IGNORE\s?\{.+?\}//gs;
	if($pdupe==0){
		print STDERR ".";
	}
	if($data =~ /['"]\/a01['"]/){# TODO: proper check 
		if($pdupe==0){
			$pdupe = 1;
			print STDERR "Dupe emotes in #$sub";
		}else{
			print STDERR ",#$sub";
		}
	}
	$css .= $data;
}
if($pdupe==1){
	print STDERR "\n";
}
$cssObj->read_string($css);
$css = $cssObj->output("CSS::Adaptor::Pretty");
if($css){
	print ("/* Parsed ".scalar(@subs)." subs */\n".$css);
	print STDERR ("Parsed ".scalar(@subs)." subs\n");
	my $thumbsCount = () = $css =~ /\/thumbs\.reddit\.com/g;
	print STDERR ("Failed thumbs count: $thumbsCount\n");
}else{
#print STDERR Dumper($cssObj);
	print STDERR "Failed to parse CSS!";
}