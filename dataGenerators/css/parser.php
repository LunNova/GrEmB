<?php

class cssParser{
	private $i = 0;
	private $cssNum = 0;
	private $len;
	private static $l = Array(","," ");
	private static $sl = Array(";");
	private static $sd = Array(":");
	private static $ss = Array("\"");
	private static $o = Array("{");
	private static $c = Array("}");
	public $selectorSeparator = "";
	
	private static function parseSelector($s){
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
	
	private static function selectorFix($s){
		$i = -1;
		$l = strlen($s);
		$debug = false;//stripos($s,":")!==false;
		if($debug){
			echo $s;
		}
		$t = "";
		$ret = Array();
		while(++$i < $l){
			$t .= $s{$i};
			if(in_array(@$s{$i+1},self::$ss)){
				$schar = $s{$i+1};
				do{
					$escape = (@$s{$i+1} == "\\"&&!$escape);
					$i++;
					$t .= @$s{$i};
				}while($i<$l&&(@$s{$i}!=$schar || $escape));

			}
			if(in_array(@$s{$i+1},self::$l)){
				if($t){
					$ret[] = $t.$s{$i+1};
					$t = "";
				}
				$i++;
			}
		}
		if($t){
			$ret[] = $t;
			$t = "";
		}
		sort($ret);
		$rVal = '';
		foreach($ret as $r){
			$dat = self::parseSelector($r);
			if($dat[0] == 'emote') $rVal .= ($dat[1].$this->selectorSeparator);
		}
		if($debug){
			echo "\n$rVal\n";
		}
		if(!$rVal){
			$rVal = ',';
		}
		return $rVal;
	}
	
	private function getProperties($sel,$root=true,&$level_=null){
		$level = 1;
		$t = "";
		$prop = "";
		$p = Array();
		if(!@$this->tokens[$sel]||@$this->tokens[$sel][1] < $this->cssNum){
			$this->tokens[$sel] = Array('props'=>Array(),'age'=>$this->cssNum);
		}
		$add = 0;
		while($level > 0 && $this->i < $this->len){
			$this->i += $add;
			$add = 0;
			$t .= $this->data{$this->i++};
			if(in_array(@$this->data{$this->i},self::$sd)&&!$prop){
				$prop = trim($t);
				$t = "";
				$this->i++;
			}
			else if(in_array(@$this->data{$this->i},self::$sl)||in_array(@$this->data{$this->i},self::$c)){
				$t = trim($t);
				if($t){
					if($root) $this->tokens[$sel]['props'][$prop] = $t;
					else $p[$prop] = $t;
				}
				$t = "";
				if(in_array(@$this->data{$this->i},self::$sl)){
					$this->i++;
				}
				while(in_array(@$this->data{$this->i},self::$c)){
					$level--;
					$level_--;
					$this->i++;
				}
				$prop = "";
			}
			else if(in_array(@$this->data{$this->i},self::$o)){
				$level++;
				$t = trim($t);
				if(!$prop) $prop = ("^".$t);
				$this->i++;
				if($root)$this->tokens[$sel]['props'][$prop] = $this->getProperties(",",false,$level);
				else $p[$prop] = $this->getProperties(",",false,$level);
				$prop = "";
				$t = "";
			}
		}
		if($level > 0){
			echo "Mismatched parens.";
		}
		return $p;
	}
	
	private function getSelector(){
		$ret = false;
		$t = "";
		while($this->i < $this->len){
			$t .= $this->data{$this->i++};
			if(in_array(@$this->data{$this->i},self::$o)){
				$t = self::selectorFix($t);
				$this->i++;
				$ret = Array($t,$this->getProperties($t));
				$t = "";
				break;
				
			}
		}
		return $ret;
	}
	
	public $tokens = Array();
	
	function parseString($css){
		$this->cssNum++;
		$css = preg_replace('/\/\*.*?\*\//','',$css);
		list($this->data,$this->len) = Array($css,strlen($css));
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
	
	function toString(){
		
	}
}
if($argv[1] == "-d"){
	$cT = new cssParser();
	$cT->parseFile("http://nallar.me/scripts/out4.min.css");
	var_dump($cT->tokens);
	unset($cT);
}
?>