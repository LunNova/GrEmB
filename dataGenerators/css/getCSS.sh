#!/bin/bash
cd /srv/www/nallar.me/css/
/usr/bin/php cssGenerator.php $1
./commit.sh