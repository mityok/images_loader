<?php
include_once("pass.php");
ini_set('max_execution_time', 300);

$href = PasswordSingleton::getInstance()->getPassword();
ini_set('memory_limit', '-1');
$gal = (int)htmlspecialchars($_GET["q"]);
$src = htmlspecialchars($_GET["s"]);
$server = (int)htmlspecialchars($_GET["r"]);

$start = (int)htmlspecialchars($_GET["t"]);
$before = microtime(true);

$message = 'ok';
$images = array();
$dr = "../thumbs/server$server/$src/images";
for($j = 1; $j <= $gal; $j++){
	$name = substr($src, 0, 2).$start.'x'.sprintf("%03s", $j).'.jpg';
	if (!file_exists('../thumbs/server'.$server.'/'.$src.'/images/'.$name)) {
		$url = 'http://www.'.$href.($server > 0 ? $server : '').'.com/'.$src.'/'.$name;
		PasswordSingleton::getInstance()->backgroundPost('http://'.$_SERVER['HTTP_HOST'].'/images_loader/server/write_post_thumb.php?link='.urlencode($dr."/".$name).'&url='.urlencode($url).'&dir='.urlencode($dr));
		$images[] = array('location'=>'WEB','status'=>'OK');
	}else{
		$images[] = array('location'=>'FILE','status'=>'OK');
	}
}
$after = microtime(true) - $before;
header('Content-Type: application/json');
header('Duration: '.$after);
echo json_encode(array(
	'duration' => $after,
	'message' => $message,
	'files' => $images
));
?>