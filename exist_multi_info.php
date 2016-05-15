<?php
include_once("pass.php");
$href = PasswordSingleton::getInstance()->getPassword();
$gal = htmlspecialchars($_GET["g"]);
$server = htmlspecialchars($_GET["s"]);
$name = htmlspecialchars($_GET["n"]);

$size = isset($_GET['z'])?(int)htmlspecialchars($_GET["z"]):50;
$start = isset($_GET['t'])?(int)htmlspecialchars($_GET["t"]):0;

$bef = microtime(TRUE);
//
$mh = curl_multi_init();
$ch = array();
$limit = -1;

for ($i = $start; $i < $start + $size; $i++) {
	$url = 'http://www.'.$href.($server>0?$server:'').'.com/'.$name.'/'.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", ($i + 1)) . '.jpg';
	$ch_1 = curl_init($url);
	curl_setopt($ch_1, CURLOPT_NOBODY, true);
	curl_setopt($ch_1, CURLOPT_HEADER, true);
	curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch_1, CURLOPT_HTTPHEADER, array("Origin: http://www.$href.com"));
	curl_setopt($ch_1, CURLOPT_USERAGENT, PasswordSingleton::getInstance()->getUserAgent());
	curl_setopt($ch_1, CURLOPT_TIMEOUT, 20);
	curl_multi_add_handle($mh, $ch_1);
	$ch[] = $ch_1;
}
$running = null;
do {
	curl_multi_exec($mh, $running);
} while ($running);
$data = array();
$len = count($ch);
for ($i = 0; $i < $len; $i++) {
	$info = curl_multi_info_read($mh);
	$d = NULL;
	if((int)$info['result'] !== 0){
		$d = array('error'=>curl_strerror($info['result']),'error_code'=>$info['result']);
	}else{
		$r = curl_multi_getcontent($ch[$i]);
		$urls[]=$r;
		$pos = strrpos($r, "200");
		if(strrpos($r, "200") !== FALSE){
			$d = array('pass'=>$i);
			$limit = $i;
		}else if(strrpos($r, "302") !== FALSE){
			$d = array('error'=>'Moved Temporarily','error_code'=>302);
		}else{
			$d = array('error'=>$r);
		}
	}
	$d['i'] = $i;
	$data[] = $d;
	curl_multi_remove_handle($mh, $ch[$i]);
}
curl_multi_close($mh);
$aft = microtime(TRUE) - $bef;
//echo $aft;
header('Content-Type: application/json');
header('Duration: '.$aft);
//echo '{"limit":'.$limit.',"url":'.json_encode($urls).',"time":'.$aft.'}';
echo json_encode(array('data'=>$data,'time'=>$aft,'start'=>$start,'size'=>$size));
?>