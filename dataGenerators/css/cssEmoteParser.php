<?php

require "cssmin-v3.0.1-minified.php";

class cssParseException extends Exception{}

class token{
	public $start = 0;
	public $len = 0;
	public $endChar = "";
	public $t = '';
	public $niceName = null;
	public $parts = [];
	public function a($s){
		$this->len+=strlen($s);
		$this->t.=$s;
	}
	public function split(){
		$this->parts[] = $this->t;
		$this->t = "";
	}
}

class cssEmoteParser{
	static $debug = ["superfine"=>0,"fine"=>1,"warning"=>2];
	private $logLevel = 0;
	private $i = 0;
	private $cssNum = 0;
	private $len;
	private $whiteSpace = ["\n"=>true,"\r"=>true];
	private $stringChars = ['"'=>true,"'"=>true];
	public $selectorSeparator = "";
	public $data = "";
	public $tokens = [];
	public $emotePriorities = [];
	
	public static $testFile = "http://reddit.com/r/mylittlepony/stylesheet.css";
	public static $testStr = null;
	
	private function DEBUG($s,$m,$pos=null){
		//return;
		if($pos === null)		$pos = $this->nicePos($this->i)."/";
		else if($pos === false)	$pos = "";
		else					$pos .= "/";
		$l = isset(self::$debug[strtolower($s)]) ? self::$debug[strtolower($s)] : 3;
		if($l >= $this->logLevel){
			echo "cssEmoteParser[$pos".strtoupper($s)."]: $m\n"; 
		}
	}
	
	private function nicePos($i){
		$line = 0;
		$linePos = 0;
		$n = 0;
		do{
			$linePos++;
			if(@$this->data{$n}==="\n"){
				$line++;
				$linePos = 0;
			}
		}while(++$n<=$i);
		return "$line:$linePos";
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
	
	private function getToken($open=[],$close=false,$str=false,$ws=false,$split=false){
		$t = "";
		$sPos = $this->i;
		$t = new token();
		if($ws === false){
			$ws = $this->whiteSpace;
		}
		if($str === false){
			$str = $this->stringChars;
		}
		if($split === false){
			$split = [];
		}
		$t->start = $this->i;
		if($close === false){
			do{
				if(isset($str[$this->data{$this->i}])){
					$schar = $this->data{$this->i};
					$t->a($this->data{$this->i});
					do{
						$escape = ($this->data{$this->i} == "\\"&&!$escape);
						$this->i++;
						$t->a($this->data{$this->i});
					}while($this->i<$this->len&&($this->data{$this->i}!=$schar || $escape));
				}else if(in_array($this->data{$this->i},$open)){
					$t->endChar = $this->data{$this->i};
					return $t;
				}else if(isset($ws[$this->data{$this->i}])){
					//do nothing?
				}else if(isset($split[$this->data{$this->i}])){
					$t->split();
				}else{
					$t->a($this->data{$this->i});
				}
			}while(++$this->i <= $this->len);
		}else{
			$level = 0;
			do{
				if(isset($str[$this->data{$this->i}])){
					$schar = $this->data{$this->i};
					$t->a($this->data{$this->i});
					do{
						$escape = ($this->data{$this->i} == "\\"&&!$escape);
						$this->i++;
						$t->a($this->data{$this->i});
					}while($this->i<$this->len&&($this->data{$this->i}!=$schar || $escape));
				}else if(in_array($this->data{$this->i},$open)){
					$level++;
					if($level > 1){
						$t->a($this->data{$this->i});
					}
				}else if(in_array($this->data{$this->i},$close)){
					$level--;
					if($level > 0){
						$t->a($this->data{$this->i});
					}
				}else if(isset($ws[$this->data{$this->i}])){
					//do nothing?
				}else if(isset($split[$this->data{$this->i}])){
					$t->split();
				}else{
					$t->a($this->data{$this->i});
				}
			}while(++$this->i <= $this->len && $level > 0);
			$t->endChar = $this->data{$this->i-1};
			return $t;
		}
	}
	
	private static function grembify($selector){
		$selector = preg_replace("/a\[href[\^|]?=['\"]?\/([\-a-zA-Z0-9_^'\"]+?)['\"]?\]/",".G_\\1_",$selector);
		$selector = str_replace("a[href","a.convertedEmote_[href",$selector);
		return $selector;
	}
	
	private function getSelector(){
		if($this->i >= $this->len) return false;
		$ret = false;
		$s = $this->getToken(["{"],false,false,false,[","=>true]);
		if(!$s){
			return false;
		}
		$s->split();
		//$this->debug('SUPERFINE', "Got selector <{$s->t}> (endchar <{$s->endChar}>)");
		$p = $this->getToken(["{"],["}"]);
		//$this->debug('SUPERFINE', "Got properties <{$p->t}> (endchar <{$p->endChar}>)");
		$emoteSel = [];
		sort($s->parts);
		foreach($s->parts as &$emote){
			if(!self::isEmote($emote)){
				continue;
			}
			$emote = self::grembify($emote);
			$emoteSel[] = $emote;
			$this->emotePriorities[$emote] = $this->cssNum;
			
		}
		unset($emote);
		if(count($emoteSel)){
			$this->tokens[] = [
				"selectors"		=>	$emoteSel,
				"properties"	=>	$p->t,
				"priority"		=>	$this->cssNum,
			];
		}

		return true;
	}
	
	public function finalize(){
		foreach($this->tokens as $k => $t){
			foreach($t["selectors"] as $ek => $emoteName){
				if($this->emotePriorities[$emoteName] > $t["priority"]){
					unset($t["selectors"][$ek]);
				}
			}
			if(count($t["selectors"])==0){
				unset($this->tokens[$k]);
			}
		}
	}
	
	private static function isEmote($s){
	//echo $s;
		if(preg_match("/a\[href[\^\|]?=['\"]?\/([^'\"]+?)['\"]?\]/",$s)>0){
			return true;
		}
		return false;
	}
	
	function parseString($css){
		$this->cssNum++;
		$css = CssMin::minify(preg_replace('/\/\*[\s\S]*?\*\//','',$css));
		list($this->data,$this->len) = [$css,strlen($css)-1];
		$this->i = 0;
		while($t = $this->getSelector()){}
		ksort($this->tokens);
	}
	
	function parseFile($file){
		$this->parseString(file_get_contents($file));
	}

	function toString(){
		$str = "";
		foreach($this->tokens as $t){
			$str .= implode(",",$t["selectors"]);
			$str .= "{" . $t["properties"] ."}\n";
		}
		return $str;
	}
}

if(@$argv[1] == "-ilcss"){
	$argv[1] = "-cssd";
	cssEmoteParser::$testStr = $argv[2];
}
if(@$argv[1] == "-cssf"){
	$argv[1] = "-cssd";
	cssEmoteParser::$testFile = $argv[2];
}
if(@$argv[1] == "-cssd"){
	$cT = new cssEmoteParser();
	try{
		if(cssEmoteParser::$testStr === null){
			$cT->parseFile(cssEmoteParser::$testFile);
		}else{
			$cT->parseString(cssEmoteParser::$testStr);
		}
	}catch(cssParseException $e){
		die($e->getMessage());
	}
	$cT->finalize();
	var_dump($cT->tokens);
	//die();
	echo @$cT->toString();
	unset($cT);
}
?>