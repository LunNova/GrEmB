#!/usr/bin/env perl

use warnings;
use strict;
use File::Slurp;
use File::Path;

my $python = $ARGV[0] || 'pypy';

mkpath('extension/release/');
mkpath('extension/unstable/');
mkpath('extension/experimental/');

my @files = read_dir 'crData';

for my $file(@files){
	my $filePath = "crData/$file";
	system "$python", ("scriptGenerator/stage1.py", $filePath,'-o',"extension/release/$file",'release.env,extension.env');
	system "$python", ("scriptGenerator/stage1.py", $filePath,'-o',"extension/unstable/$file",'unstable.env,extension.env');
}

system "$python scriptGenerator/stage1.py -o extension/release/content.js GrEmB.plus.js release.env,extension.env";
system "$python scriptGenerator/stage1.py -o extension/unstable/content.js GrEmB.plus.js unstable.env,extension.env";