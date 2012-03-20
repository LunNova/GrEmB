#!/bin/bash
echo -ne "Building unstable release."
pypy -ES scriptGenerator/stage1.py -o GrEmBunstable.user.js GrEmB.plus.js unstable.env
echo -ne "\nBuilding stable release."
pypy -ES scriptGenerator/stage1.py -o GrEmB.user.js GrEmB.plus.js release.env
