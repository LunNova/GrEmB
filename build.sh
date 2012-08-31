./buildExtension.pl
./buildUserscripts.sh
cd extension/release
zip -9 ../release.zip *
cd ../unstable
zip -9 ../unstable.zip *
~/rs.sh