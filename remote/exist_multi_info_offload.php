<?php
ini_set('max_execution_time', 300);
$gal = htmlspecialchars($_GET["g"]);
$server = htmlspecialchars($_GET["s"]);
$name = htmlspecialchars($_GET["n"]);
$href = isset($_GET['href'])?htmlspecialchars($_GET["href"]):'';
$size = isset($_GET['z'])?(int)htmlspecialchars($_GET["z"]):50;
$start = isset($_GET['t'])?(int)htmlspecialchars($_GET["t"]):0;
$bef = microtime(TRUE);
$proxy=NULL;
//
if (substr($_SERVER['REMOTE_ADDR'], 0, 4) == '127.'
        || $_SERVER['REMOTE_ADDR'] == '::1') {
	include_once("../server/pass.php");
	$proxy = PasswordSingleton::getInstance()->getProxy();
}
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
	curl_setopt($ch_1, CURLOPT_TIMEOUT, 200);
	curl_setopt($ch_1, CURLOPT_PROXY, $proxy);
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

		if(strrpos($r, "200") !== FALSE){
			$d = array('pass'=>$i);
			$limit = $i+1;
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
echo json_encode(array("limit"=>$limit,"gal"=>$gal,'time'=>$aft,'length'=>$len));
//echo json_encode(array('data'=>$data,'time'=>$aft,'urls'=>$urls));
?>