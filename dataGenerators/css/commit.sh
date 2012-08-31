cd /srv/www/nallar.me/css
str="Emotes: "`cat main.count`" Time:"`date`
/usr/bin/git add -A .
/usr/bin/git commit -m "Emotes: `cat main.count` Time: `date +'%x %X'`"
/usr/bin/git push