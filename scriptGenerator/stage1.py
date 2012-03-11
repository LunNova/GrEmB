#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import print_function
import re,sys,argparse,ConfigParser

class DictConfigParser(ConfigParser.ConfigParser):
	def get(self, section, option):
		value = ConfigParser.ConfigParser.get(self, section, option)
		if (value[0] == "{") and (value[-1] == "}"):
			return eval(value)
		else:
			return value

parser = argparse.ArgumentParser(description='Run stage 1 JS+ preprocessor.')
parser.add_argument('inputFile',help='Input JS+ file')
parser.add_argument('envFile',help='Environment data file')
parser.add_argument('-o --outputFile',dest='outFile',help='Output file. (defaults to stdout)')
args = parser.parse_args()

config = DictConfigParser()
config.read(args.envFile)

sys.stdout.softspace = False

d = open(args.inputFile,'rb').read()
def error(s):
	print(s,file=sys.stderr,end='')
	return;

def parseJS(d,depth):
	if depth>20:
		raise Exception("parseJS depth above limit. Check that you have not got an infinitely recursing include cycle...")
	while 1:
		m = re.search("//INCLUDE ['\"]([a-zA-Z0-9_/\\.\\\\]+)['\"]", d,re.DOTALL)
		if m == None: m = re.search("/\*INCLUDE ['\"]([a-zA-Z0-9_/\\.\\\\]+)['\"]\*/", d,re.DOTALL)
		if m == None: break
		fName = m.group(1)
		incName = (config.get('Options','incDir')+'/'+fName)
		try:
			d = d.replace(m.group(0),parseJS(open(incName,'rb').read(),depth+1))
		except ConfigParser.Error:
			error("[Options]->incDir must be set in environment file to use includes.");exit(1)
		except IOError:
			error("Could not read "+incName+" check the incDir and included file exist.");exit(1)
	while 1:
		m = re.search("//IF ([a-zA-Z0-9_]+)(.+?)(?://ELSE(.+?))?//END ?IF", d,re.DOTALL)
		if m == None: break;
		var = m.group(1)
		trueCode = m.group(2)
		falseCode = m.group(3)
		ms = re.search("^(.+?)//ELSE(.+)//END ?IF",trueCode,re.DOTALL)
		if ms:
			trueCode = ms.group(1)
			falseCode = ms.group(2)
		
		try:
			if config.get('Vars',var)==True:
				code = trueCode
			elif falseCode:
				code = falseCode
			else:
				code = ''
		except ConfigParser.Error: error("[Vars]->"+var+" must be set in environment file to use includes.");exit(1)
		if args.outFile:
			print(var+config.get('Vars',var))
		d = d.replace(m.group(0),code)
	return d;
d = parseJS(d,0)
if args.outFile:
	open(args.outFile,'wb').write(d)
else:
	print(d)