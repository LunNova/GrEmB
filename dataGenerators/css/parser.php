<?php

class cssParser{
	private $i = 0;
	private $data = "";
	private $len;
	private $l = Array(",");
	private $sl = Array(";");
	private $sd = Array(":");
	private $o = Array("{");
	private $c = Array("}");
	
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
			if(in_array(@$this->data{$this->i},$this->sd)){
				$prop = trim($t);
				$t = "";
				$this->i++;
			}
			else if(in_array(@$this->data{$this->i},$this->sl)||in_array(@$this->data{$this->i},$this->c)){
				$t = trim($t);
				if($t){
					$this->tokens[$sel][$prop] = $t;
					$p[$prop] = $t;
				}
				$t = "";
				while(in_array(@$this->data{$this->i},$this->c)){
					
					$level--;
					$level_--;
					$this->i++;
				}
				
				$prop = "";
			}
			else if(in_array(@$this->data{$this->i},$this->o)){
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
			if(in_array(@$this->data{$this->i},$this->o)){
				$t = trim($t);
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
		list($this->data,$this->len) = Array($css,strlen($css));
		while($t = $this->getSelector()){}
		unset($this->tokens[',']);
	}
	
	function parseFile($file){
		$this->parseString(file_get_contents($file));
	}
}
?>