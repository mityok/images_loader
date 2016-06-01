<?php
include_once("pass.php");
$bef = microtime(TRUE);
$href = PasswordSingleton::getInstance()->getPassword();
$proxy = PasswordSingleton::getInstance()->getProxy();
$start=isset($_GET['s'])?htmlspecialchars($_GET["s"]):0;
$end=isset($_GET['e'])?htmlspecialchars($_GET["e"]):500;
$page=isset($_GET['p'])?htmlspecialchars($_GET["p"]):25;
$name = isset($_GET['n'])?'&Name='.htmlspecialchars($_GET["n"]):'';
//
$errors = NULL;
set_error_handler('exceptions_error_handler');

function exceptions_error_handler($severity, $message, $filename, $lineno) {
  if (error_reporting() == 0) {
    return;
  }
  if (error_reporting() & $severity) {
    throw new ErrorException($message, 0, $severity, $filename, $lineno);
  }
}
//
$mh = curl_multi_init();
$ch = array();
$limit = -1;
$total_items = -1;
$end_item = -1;
$items = array();
for ($i = $start; $i < $end; $i += $page) {
	$url = "http://search.$href.com/cgi-bin/search/1227c.pl";
	$ch_1 = curl_init($url);
	curl_setopt($ch_1, CURLOPT_POST, 1);
	curl_setopt($ch_1, CURLOPT_HEADER, 1);
	curl_setopt($ch_1, CURLOPT_POSTFIELDS,"startitem=".$i.$name);
	curl_setopt($ch_1, CURLOPT_PROXY, $proxy);
	curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch_1, CURLOPT_TIMEOUT, 25);
	curl_multi_add_handle($mh, $ch_1);
	$ch[] = $ch_1;
}
$running = null;
do {
	curl_multi_exec($mh, $running);
} while ($running);

foreach ($ch as $ch_1) {
	$info = curl_multi_info_read($mh);
	if((int)$info['result'] !== 0){
		echo curl_strerror($info['result']).' - '.$info['result'].'<br>';
		continue;
	}
	//die('<br>jkj');
	$r = curl_multi_getcontent($ch_1);
	curl_multi_remove_handle($mh, $ch_1);
	$proc = get_headers_from_curl_response($r);
	if($proc){
		parse($proc['body'], $ch_1);
	}else{
		var_dump($r);
	}
}
function get_headers_from_curl_response($response){
    $headers = array();
	$pos = strpos($response, "\r\n\r\n");
	if($pos === FALSE){
		return NULL;
	}
    $header_text = substr($response, 0, $pos);
	$body = substr($response, $pos);
    foreach (explode("\r\n", $header_text) as $i => $line){
        if ($i === 0){
            $headers['http_code'] = $line;
		}else{
            list ($key, $value) = explode(': ', $line);
            $headers[$key] = $value;
        }
	}
    return array('headers'=>$headers,'body'=>$body);
}
function parse($resp, $ch){
	global $items, $total_items, $end_item, $href, $errors;
	$document = new DOMDocument();
	@$document->loadHTML($resp);
	$tags = $document->getElementsByTagName('img');
	$body = $document->getElementsByTagName('body');

	if($body->length !== 1){
		var_dump($ch);
		var_dump($resp);
		die('error');
	}
	$p = $body->item(0)->getElementsByTagName('p');
	$nums = $p->item(2);
	if($nums){
		$str = $nums->textContent;
		preg_match_all('!\d+!', $str, $matches);
		$total_items = (int)$matches[0][0];
		$start = $matches[0][1];
		$end = (int)$matches[0][2];
		if($end>$end_item){
			$end_item = $end;
		}	
	}
	try {
		foreach ($tags as $tag) {
			$src =  $tag->getAttribute('src');
			$pos = strrpos($src, "1.jpg");
			$pos2 = strrpos($src, $href);
			if($pos !== FALSE && $pos2 !== FALSE){
				$item = array();
				//image name dosn't correspond with folder
				$link = explode('/',$tag->parentNode->getAttribute('href'))[3];
				//
				$imgPhTr = $tag->parentNode->parentNode->parentNode;
				$nameTr = $imgPhTr->previousSibling;
				$ageTr = $imgPhTr->nextSibling;
				$updatesTr = $ageTr->nextSibling;
				$dateTr = $updatesTr->nextSibling->nextSibling->nextSibling;	
				$url = explode('/',$src);
				//$item['href'] = $url[2];
				$item['server'] = abs((int)filter_var($url[2], FILTER_SANITIZE_NUMBER_INT));
				$imgSrc = substr($url[3],0,-5);
				if($imgSrc!==$link){
					$item['imgsrc'] = $imgSrc;
				}
				$item['src'] = $link;

				$item['age'] = $ageTr->childNodes[1]->textContent;
				$item['updates'] = $updatesTr->childNodes[1]->textContent;
				$item['name'] = $nameTr->childNodes[1]->textContent;
				$item['ph'] = $imgPhTr->childNodes[14]->textContent;
				$item['date'] = $dateTr->childNodes[1]->textContent;
				
				$items[] = $item;
			}
		}
	} catch (Exception $e) {
		if(!$errors){
			$errors=array();
		}
      $errors[]=$e->getMessage();
	}
}
curl_multi_close($mh);
$aft = microtime(TRUE) - $bef;
header('Content-Type: application/json');
header('Duration: '.$aft);
echo json_encode(array('items'=>$items,'end'=>$end_item,'total'=>$total_items,'duration'=>$aft,'errors'=>$errors));
?>