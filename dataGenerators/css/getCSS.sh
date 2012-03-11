cd $(DATADIR)
php cssGetter.php "nsfw" > nsfw.css
php cssMin.php "$(DATADIR)nsfw.css"> temp.css
mv temp.css nsfw.min.css
echo "Parsed nsfw CSS to min"
/usr/local/bin/perl cssGetter.pl > temp.css
php cssGetter.php > temp_.css
php cssMin.php "$(DATADIR)temp_.css"> temp__.css
echo "Parsed main CSS to min"
mv temp__.css out4.min.css
php cssBackup.php
/usr/local/bin/perl cssGetter.pl other > temp.css
php cssGetter.php "other.min.css"> temp_.css
php cssMin.php "$(DATADIR)temp_.css" "other.min.css" > temp__.css
echo "Parsed main CSS to min"
mv temp__.css other.min.css
