<?php
include_once("pass.php");
$href = PasswordSingleton::getInstance()->getPassword();
$proxy = PasswordSingleton::getInstance()->getProxy();
ini_set('memory_limit', '-1');
$gal_arr = json_decode(file_get_contents("php://input"));
$src = htmlspecialchars($_GET["s"]);
$server = (int)htmlspecialchars($_GET["r"]);
$page = (int)htmlspecialchars($_GET["p"]);
$start = (int)htmlspecialchars($_GET["t"]);
if($page === 0 || $page > count($gal_arr)){
	$page = count($gal_arr)-1;
}
//100 files - 10 to 15 seconds
//http://localhost:9090/sc_srch/multi_image_get.php?q=[0,2,3,2,1]&s=ladycoral&r=4&t=1&p=4
$before = microtime(true);
$data = array();
$response = array();
$message = 'ok';
$images = array();
for($i = $start; $i < $page + $start; $i++){
	$cur_pics = $gal_arr[$i];
	for($j = 1; $j <= $cur_pics; $j++){
		$name = $src.'/'.substr($src, 0, 2).$i.'x'.sprintf("%03s", $j).'.jpg';
		if (!file_exists('../thumbs/'.$name)) {
			$data[] = 'http://www.'.$href.($server > 0 ? $server : '').'.com/'.$name;
		}else{
			$images[] = array('location'=>'FILE','status'=>'OK');

		}
	}
}
//echo $page;
//echo $href;
//echo $proxy;
//print_r($data);
//die('stop');
// build the individual requests, but do not execute them
$chrls = array();
$mh = curl_multi_init();
$len = count($data);
for($i = 0; $i < $len; $i++){
	$chr = curl_init($data[$i]);
	curl_setopt($chr, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($chr, CURLOPT_PROXY, $proxy);
	curl_setopt($chr, CURLOPT_HEADER, 1);
	curl_setopt($chr, CURLOPT_CONNECTTIMEOUT, 10);
	curl_multi_add_handle($mh, $chr);
	$chrls[] = $chr;
}
$running = null;
do {
	curl_multi_exec($mh, $running);
} while ($running);

//close the handles
for($i = 0; $i < $len; $i++){
	curl_multi_remove_handle($mh, $chrls[$i]);
	$content = curl_multi_getcontent($chrls[$i]);
	//
	$hlength = curl_getinfo($chrls[$i], CURLINFO_HEADER_SIZE);
	$httpCode = curl_getinfo($chrls[$i], CURLINFO_HTTP_CODE);
	$body = substr($content, $hlength);
	//
	$response[] = $httpCode;
	if($httpCode === 200){
		$filename = array_pop(explode('/', $data[$i]));
		storeFile($body, $src, $filename);
		$images[] = array('location'=>'WEB','status'=>'OK');
	}else{
		$images[] = array('location'=>'WEB','status'=>'ERROR');
		$message = 'error';
	}
}
curl_multi_close($mh);
$after = microtime(true) - $before;
header('Content-Type: application/json');
header('Duration: '.$after);
echo json_encode(array(
	'duration' => $after,
	'message' => $message,
	'files' => $images
));
function storeFile($data,$src,$filename){
	$dr = '../thumbs/'.$src;
	if (file_exists($dr)) {
	}else{
		mkdir($dr, 0777, true);
	}
	file_put_contents($dr."/".$filename, $data);
}
?>