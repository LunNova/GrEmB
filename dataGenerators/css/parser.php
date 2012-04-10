<?php

class cssParser{
	private $i = 0;
	private $data = "";
	private $len;
	private static $l = Array(",");
	private static $sl = Array(";");
	private static $sd = Array(":");
	private static $ss = Array("\"");
	private static $o = Array("{");
	private static $c = Array("}");
	
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
				$ret[] = $t;
				$t = "";
			}
		}
		$ret[] = $t;
		$t = "";
		sort($ret);
		$ret = implode(self::$sl[0],$ret);
		if($debug){
			echo "\n$ret\n";
		}
		return $ret;
	}
	
	private function getProperties($sel,&$level_=null){
		$level = 1;
		$t = "";
		$prop = "";
		$p = Array();
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
					$this->tokens[$sel][$prop] = $t;
					$p[$prop] = $t;
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
				if(!$prop) $prop = $t;
				$this->i++;
				$this->tokens[$sel][$prop] = $this->getProperties(",",$level);
				$p[$prop] = $this->tokens[$sel][$prop];
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
		$css = preg_replace('/\/\*.*?\*\//','',$css);
		list($this->data,$this->len) = Array($css,strlen($css));
		while($t = $this->getSelector()){}
		unset($this->tokens[',']);
	}
	
	function parseFile($file){
		$this->parseString(file_get_contents($file));
	}
}
if($argv[1] == "-d"){
	$cT = new cssParser();
	$cT->parseFile("http://nallar.me/scripts/out4.min.css");
	var_dump($cT->tokens);
	unset($cT);
}
?>