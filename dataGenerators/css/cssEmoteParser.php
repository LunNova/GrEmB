<?php

class cssParseException extends Exception{}

class cssEmoteParser{
	private $i = 0;
	private $cssNum = 0;
	private $len;
	private $l = Array(","," ");
	private $sl = Array(";");
	private $sd = Array(":");
	private $ss = Array("\"");
	private $o = Array("{");
	private $c = Array("}");
	public $selectorSeparator = "";
	public $data = "";
	public $errorPos = 0;
	public $tokenLen = 0;
	
	public static $testStr = null;
	
	private function nicePos($i){
		$line = 0;
		$linePos = 0;
		$n = 0;
		do{
			$linePos++;
			if(@$this->data{$i}==="\n"){
				$line++;
				$linePos = 0;
			}
		}while(++$n<=$i);
		return "$line: $linePos";
	}
	
	private function parseSelector($s){
		$c = substr($s,0,1);
		$mType = preg_match('/a(?:\:\:?[a-zA-Z]+?)?\[href.\=/',$s)?'emote':'elem';
		switch($c){
			case '.':
				$t = 'class';
				$s = substr($s,1);
				break;
			default:
				$t = $mType;
		}
		return Array($t,$s);
		
	}
	
	private function selectorFix($s){
		$i = -1;
		$s = trim($s);
		$l = strlen($s);
		$debug = false;//stripos($s,":")!==false;
		if($debug){
			echo $s;
		}
		$t = "";
		$ret = Array();
		while(++$i < $l){
			$t .= $s{$i};
			if(in_array(@$s{$i+1},$this->ss)){
				$schar = $s{$i+1};
				do{
					$escape = (@$s{$i+1} == "\\"&&!$escape);
					$i++;
					$t .= @$s{$i};
				}while($i<$l&&(@$s{$i}!=$schar || $escape));

			}
			if(in_array(@$s{$i+1},$this->l)){
				if($t){
					$ret[] = $t.$s{$i+1};
					$t = "";
				}
				$i++;
			}
		}
		if($t){
			$ret[] = "$t,";
			$t = "";
		}
		sort($ret);
		$rVal = '';
		foreach($ret as $r){
			$dat = $this->parseSelector($r);
			if($dat[0] == 'emote') $rVal .= ($dat[1].$this->selectorSeparator);
		}
		if($debug){
			echo "\n$rVal\n";
		}
		if(!$rVal){
			$rVal = ',';
		}elseif(substr($rVal,-1,1)==","){
			$rVal = substr($rVal,0,strlen($rVal)-1);
		}
		return $rVal;
	}
	
	private function getProperties($sel,$root=true){
		$level = 1;
		$t = "";
		$prop = "";
		$errorData = ["startPos"=>$this->i,"tokenLen"=>-1,"niceName"=>"unknown"];
		$isError = false;
		$resetToken = false;
		$p = Array();
		if(!@$this->tokens[$sel]||@$this->tokens[$sel][1] < $this->cssNum){
			$this->tokens[$sel] = Array('props'=>Array(),'age'=>$this->cssNum);
		}
		do{
			$endPropertyValue = in_array(@$this->data{$this->i},$this->sl);
			$endProperties = in_array(@$this->data{$this->i},$this->c);
			$endPropertyName = in_array(@$this->data{$this->i},$this->sd);
			$openPropertyValue = in_array(@$this->data{$this->i},$this->o);
			if($endPropertyName&&!$prop){
				$prop = trim($t);
				if(!$prop){
					$errorData['startPos'] = $this->i;
					$errorData['tokenLen'] = 1;
					$errorData['niceName'] = ':';
					$isError = true;
					break;
				}
				$resetToken = true;
			}else if($endPropertyValue||$endProperties){
				if(trim($t)&&$prop){
					if($root) $this->tokens[$sel]['props'][$prop] = $t;
					else $p[$prop] = $t;
					$resetToken = true;
				}else{
					if(trim($t) && !$prop){
						$errorData['startPos'] = $this->i;
						$errorData['tokenLen'] = 1;
						$errorData['niceName'] = $endProperties ? '}' : ';';
						$isError = true;
						break;
					}
				}
				if($endProperties)$level--;
				$prop = "";
			}else if($openPropertyValue){
				$level++;
				$t = trim($t);
				if(!$prop) $prop = ($t);
				$this->i++;
				if($root)$this->tokens[$sel]['props'][$prop] = $this->getProperties(",",false,$level);
				else $p[$prop] = $this->getProperties(",",false);
				$prop = "";
				$resetToken = true;
			}else{
				$t .= $this->data{$this->i};
			}
			$errorData['tokenLen']++;
			if($resetToken){
				$resetToken = false;
				$t = "";
				$errorData['startPos'] = $this->i+1;
				$errorData['tokenLen'] = -1;
			}
			
		}while($level > 0 &&$this->i++ < $this->len);
		if(!$isError&&($t||($t = $prop))){
			$errorData['niceName'] = $prop ? 'propertyValue':'propertyName';
			$isError = true;
		}else if(!$isError && $level > 0){
			throw new cssParseException("Unexpected end of file - check that you haven't forgotten a closing \"}\"");
		}
		if($isError){
			$left = substr($this->data,($errorData['startPos']-11),11);
			$right = substr($this->data,($errorData['startPos']+$errorData['tokenLen']),10);
			$errorToken = substr($this->data,$errorData['startPos'],$errorData['tokenLen']);
			throw new cssParseException("Unexpected {$errorData['niceName']} at ".$this->nicePos($errorData['startPos'])."\n$left\033[1;34m".$errorToken."\033[00m$right");
		}
		return $p;
	}
	
	private function getSelector(){
		if($this->i >= $this->len) return false;
		$ret = false;
		$t = "";
		do{
			if(in_array(@$this->data{$this->i},$this->o)){
				$t = $this->selectorFix($t);
				$this->i++;
				$ret = Array($t,$this->getProperties($t));
				$t = "";
				break;
				
			}else{
				$t .= $this->data{$this->i};
			}
		}while($this->i++ < $this->len);
		return $ret;
	}
	
	public $tokens = Array();
	
	function parseString($css){
		$this->cssNum++;
		$css = preg_replace('/\/\*[\s\S]*?\*\//','',$css);
		list($this->data,$this->len) = Array($css,strlen($css)-1);
		while($t = $this->getSelector()){}
		unset($this->tokens[',']);
		ksort($this->tokens);
	}
	
	function parseFile($file){
		$this->parseString(file_get_contents($file));
	}
	
	function selectorToString($s){
		return $ret;
	}
	
	function propertiesToString($p){
		if(is_string($p)){
			return ":$p";
		}
		if(@is_array($p["props"])){
			$p = $p["props"];
		}
		var_dump($p);
		$str = "{";
		foreach($p as $pp => $pv){
			$str .= "$pp". $this->propertiesToString($pv).";";
		}
		return $str."}";
	}
	
	function toString(){
		$str = "";
		foreach($this->tokens as $sel => $value){
			$str .= "$sel".$this->propertiesToString($value)."";
		}
		return $str;
	}
}

if($argv[1] == "-ilcss"){
	$argv[1] = "-cssd";
	cssEmoteParser::$testStr = $argv[2];
}
if($argv[1] == "-cssd"){
	$cT = new cssEmoteParser();
	try{
		if(cssEmoteParser::$testStr === null){
			$cT->parseFile("http://reddit.com/r/mylittlepony/stylesheet.css");
		}else{
			$cT->parseString(cssEmoteParser::$testStr);
		}
	}catch(cssParseException $e){
		die($e->getMessage());
	}
	//var_dump($cT->tokens);
	echo @$cT->toString();
	unset($cT);
}
?>