#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import print_function
import re,sys,argparse,ConfigParser

class DictConfigParser(ConfigParser.SafeConfigParser):
	def get(self, section, option):
		value = ConfigParser.SafeConfigParser.get(self, section, option)
		if (value[0] == "{") and (value[-1] == "}"):
			return eval(value)
		else:
			return value

conf = {}

def readConfig(file):
	global conf, args
	config = DictConfigParser()
	config.optionxform = str 
	config.read(args.envDir+'/'+file)
	for k in config._sections.keys():
		if k in conf:
			conf[k].update(config._sections[k])
		else:
			conf[k] = config._sections[k]
	

parser = argparse.ArgumentParser(description='Run stage 1 JS+ preprocessor.')
parser.add_argument('inputFile',help='Input JS+ file')
parser.add_argument('envFile',help='Environment data file')
parser.add_argument('-o --outputFile',dest='outFile',help='Output file. (defaults to stdout)')
parser.add_argument('-e --envDir',dest='envDir',help='Environments directory. Defaults to env',default='env')
args = parser.parse_args()

readConfig('global.env')
readConfig(args.envFile)

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
		try:
			incName = (conf['Options']['incDir']+'/'+fName)
			d = d.replace(m.group(0),parseJS(open(incName,'rb').read(),depth+1))
		except KeyError:
			error("[Options]->incDir must be set in environment file to use includes.");exit(1)
		except IOError:
			error("Could not read "+fName+" check the incDir and included file exist.");exit(1)
	while 1:
		m = re.search("%%([^%]{1,20})%%", d,re.DOTALL)
		if m == None: break
		vName = m.group(1)
		try:
			d = d.replace(m.group(0),parseJS(conf['Vars'][vName],depth+1))
		except KeyError:
			error("[Vars]->"+vName+" must be set in environment file to use includes.");exit(1)
	while 1:
		m = re.search("//IF (\!?)([a-zA-Z0-9_]+)(.+?)(?://ELSE(.+?))?//END ?IF", d,re.DOTALL)
		if m == None: break;
		var = m.group(2)
		trueCode = m.group(3)
		falseCode = m.group(4)
		ms = re.search("^(.+?)//ELSE(.+)//END ?IF",trueCode,re.DOTALL)
		if ms:
			trueCode = ms.group(2)
			falseCode = ms.group(3)
		if m.group(1):
			trueCode, falseCode = falseCode, trueCode
		try:
			if conf['Vars'][var]==True:
				code = trueCode
			elif falseCode:
				code = falseCode
			else:
				code = ''
		except KeyError: error("[Vars]->"+var+" must be set in environment file to use includes.");exit(1)
		#if args.outFile:
		#	print(var+conf['Vars'][var])
		d = d.replace(m.group(0),code)
	return d;
d = parseJS(d,0)
if args.outFile:
	open(args.outFile,'wb').write(d)
else:
	print(d)