<?php

require "cssmin-v3.0.1-minified.php";

class cssParseException extends Exception{}

class token{
	public $start = 0;
	public $len = 0;
	public $endChar = "";
	public $t = '';
	public $niceName = null;
	public $parts = Array();
	public function a($s){
		$this->len+=strlen($s);
		$this->t.=$s;
	}
	public function split(){
		$this->parts[] = $this->t;
		$this->t = "";
	}
}

function strca($haystack, $needles, $offset = 0){
	foreach($needles as $needle) {
		if(strpos($haystack, $needle, $offset)!==false) return true;
	}
	return false;
}

class cssEmoteParser{
	static $debug = Array("superfine"=>0,"fine"=>1,"warning"=>2);
	private $logLevel = 0;
	private $i = 0;
	private $cssNum = 0;
	private $len;
	private $whiteSpace = Array("\n"=>true,"\r"=>true);
	private $stringChars = Array('"'=>true,"'"=>true);
	private $stringCache = false;
	public $selectorSeparator = "";
	public $data = "";
	public $tokens = Array();
	public $emotePriorities = Array();
	public $nsfw = Array('/o21h4/','/yqm7o/','.domain','rsaddash','class~="comments"','.sidecontentbox','.thumbnail','.title', '#siteTable', '.link');
	public $names = Array();
	public $noCompress = Array();
	public $emoteCount = 0;
	
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
	
	private function getToken($open=Array(),$close=false,$str=false,$ws=false,$split=false){
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
			$split = Array();
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
		$selector = preg_replace("/a(?:.md)?\[href[|]?=['\"]?\/([a-zA-Z0-9_^'\"]+?)['\"]?\]/",".G_\\1_",$selector);
		$selector = str_replace("a[href",".md a[href",$selector);
		$selector = str_replace(".md .md",".md",$selector);
		$selector = str_replace("+ .md a[","+ a[",$selector);
		return $selector;
	}
	
	private function getSelector(){
		if($this->i >= $this->len) return false;
		$ret = false;
		$s = $this->getToken(Array("{"),false,false,false,Array(","=>true));
		if(!$s){
			return false;
		}
		$s->split();
		//$this->debug('SUPERFINE', "Got selector <{$s->t}> (endchar <{$s->endChar}>)");
		$p = $this->getToken(Array("{"),Array("}"));
		if($p->t == ""){
			return true;
		}
		//$this->debug('SUPERFINE', "Got properties <{$p->t}> (endchar <{$p->endChar}>)");
		$emoteSel = Array();
		sort($s->parts);
		foreach($s->parts as &$emote){
			if(!self::isEmote($emote) || @$this->emotePriorities[$cn=self::cleanName($emote = self::grembify($emote))] > $this->cssNum){
				continue;
			}
			$emoteSel[] = $emote;
			$this->emotePriorities[$cn] = $this->cssNum;
			
		}
		unset($emote);
		if(count($emoteSel)){
			$this->tokens[] = Array(
				"selectors"		=>	$emoteSel,
				"properties"	=>	$p->t,
				"priority"		=>	$this->cssNum,
			);
		}

		return true;
	}
	
	private static function cleanName($emote){
		return str_replace(array("::after","::before",":after",":before"),"",$emote);
	}
	
	public function finalize(){
		$byProperties = Array();
		$nc = " ";
		$this->tokens = array_reverse($this->tokens);
		foreach($this->tokens as $k => &$t){
			foreach($t["selectors"] as $ek => &$emoteName){
				if(@$this->emotePriorities[self::cleanName($emoteName)] > $t["priority"]){
					unset($t["selectors"][$ek]);
				}
				if(strca($emoteName,$this->nsfw)){
					unset($t["selectors"][$ek]);
					unset($this->emotePriorities[self::cleanName($emoteName)]);
				}
			}
			if(count($t["selectors"])==0){
				unset($this->tokens[$k]);
				continue;
			}
			$this->emoteCount += count($t["selectors"]);
			$propKey = $t["properties"];
			if(@$noCompress[$t["priority"]]){
				$propKey .= ($nc .= " ");
			}
			if(!isset($byProperties[$propKey])){
				$byProperties[$propKey] = Array($t);
			}else{
				$byProperties[$propKey][] = $t;
			}
		}
		//return;
		$this->tokens = Array();
		$i = 0;
		foreach($byProperties as $props => $s){
			$this->tokens[$i] = array_shift($s);
			if(count($s) >= 1){
				foreach($s as $ss){
					$this->tokens[$i]["selectors"] = array_merge($this->tokens[$i]["selectors"],$ss["selectors"]);
				}
				$this->tokens[$i]["selectors"] = array_unique($this->tokens[$i]["selectors"]);
			}
			$i++;
		}
		$this->tokens = array_reverse($this->tokens);
	}
	
	private static function isEmote($s){
	//echo $s;
		if(stripos($s,".G_")!==false || preg_match("/a(?:\.convertedEmote_)?\[href[\^\|]?=['\"]?\/([^'\"]+?)['\"]?\]/",$s)>0 || preg_match("/a(?:\.convertedEmote_)?\[href\*=['\"]?([^'\"]+?)['\"]?\]/",$s)>0){
			return true;
		}
		return false;
	}
	
	function parseString($css,$name="",$clean=false,$noCompress=false){
		$this->cssNum++;
		$this->stringCache = false;
		$this->names[$this->cssNum] = $name;
		$this->noCompress[$this->cssNum] = $noCompress;
		$css = str_replace(array(" !important","!important","display:block;","float:ssleft;","clear:none;"),"",$css);
		$css = preg_replace('/\/\*[\s\S]*?\*\//','',$css);
		if($clean){
			$css = CssMin::minify($css);
		}
		list($this->data,$this->len) = Array($css,strlen($css)-1);
		$this->i = 0;
		while($t = $this->getSelector()){}
	}
	
	function parseFile($file){
		$this->parseString(file_get_contents($file),$file);
	}

	function toString(){
		if($this->stringCache){
			return $this->stringCache;
		}
		$str = "/*Parsed {$this->emoteCount} emote aliases.*/\n";
		foreach($this->tokens as $t){
			$sel = implode(",",$t["selectors"]);
			//if(stripos($sel,"/],")!==false || stripos($t["properties"],"/],")!==false){ echo $this->names[$t["priority"]]."\t"."\n";
			//var_dump($t);}
			$str .= $sel;
			$str .= "{" . $t["properties"] ."}\n";
		}
		return ($this->stringCache = $str);
	}
	
	function getEmoteNames(){
		preg_match_all("/\.G_([0-9a-zA-Z]+)_/i", $this->toString(), $ret);
		preg_match_all("/a(?:\.convertedEmote_)?\[href[\*\^\|]?=['\"]\/([^'\"]+?)['\"]/i", $this->toString(), $ret2);
		
		$ret = array_unique(array_merge($ret[1],$ret2[1]));
		natsort($ret);
		return $ret;
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