#!/usr/bin/env perl

use warnings;
use strict;
use File::Slurp;
use File::Path;

my $python = $ARGV[0] || 'pypy -ES';

mkpath('extension/release/');
mkpath('extension/unstable/');

my @files = read_dir 'crData';

for my $file(@files){
	exec "$python scriptGenerator/stage1.py", ($file,'-o','extension/release/$file','GrEmB.plus.js','release.env,extension.env');
	exec "$python scriptGenerator/stage1.py", ($file,'-o','extension/unstable/$file','GrEmB.plus.js','unstable.env,extension.env');
}

exec "$python scriptGenerator/stage1.py -o extension/release/content.js GrEmB.plus.js release.env,extension.env";
exec "$python scriptGenerator/stage1.py -o extension/unstable/content.js GrEmB.plus.js unstable.env,extension.env";