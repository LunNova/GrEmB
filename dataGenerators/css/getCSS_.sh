#!/bin/bash
cd /srv/www/nallar.me/css/
/usr/bin/php cssGenerator.php -c
str="Emotes: "`cat main.count`" Time:"`date`
cd unstable
/usr/bin/git add -A .
/usr/bin/git commit -m "Emotes: `cat ../main.count` Time: `date +'%x %X'`" > /dev/null
/usr/bin/git push