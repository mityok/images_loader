<?php
include_once("pass.php");
$href = PasswordSingleton::getInstance()->getPassword();
$proxy = PasswordSingleton::getInstance()->getProxy();
ini_set('memory_limit', '-1');
$gal_arr = json_decode(file_get_contents("php://input"));
$src = htmlspecialchars($_GET["s"]);
$server = (int)htmlspecialchars($_GET["r"]);
$start = getValidStart($gal_arr);
function getValidStart($arr){
	for($i = 0;$i<count($arr);$i++){
		if($arr[$i]){
			return $i;
		}
	}
	return -1;
}
//100 files - 10 to 15 seconds
//http://localhost:9090/sc_srch/multi_image_get.php?q=[0,2,3,2,1]&s=ladycoral&r=4&t=1&p=4
$before = microtime(true);
$data = array();
$response = array();
$message = 'ok';
$images = array();
$dr = "../thumbs/server$server/$src/images";
if (file_exists($dr)) {
	for($i = $start; $i < count($gal_arr); $i++){
		$cur_pics = $gal_arr[$i];
		$images[$i]=0;
		for($j = 1; $j <= $cur_pics; $j++){
			if (file_exists($dr .'/'.substr($src, 0, 2).$i.'x'.sprintf("%03s", $j).'.jpg')) {
				$images[$i]=$j;
			}else{
				break;
			}
		}
	}
}else{
	$message = "error";
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