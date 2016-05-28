<?php
ini_set('max_execution_time', 3000);

$gal = htmlspecialchars($_GET["g"]);
$server = htmlspecialchars($_GET["s"]);
$name = htmlspecialchars($_GET["n"]);
$href = isset($_GET['href'])?htmlspecialchars($_GET["href"]):'';
$bef = microtime(TRUE);
//
$mh = curl_multi_init();
$ch = array();


for ($i = 1; $i < 30; $i++) {
	$url = 'http://mityok.hostfree.pw/sc/exist_multi_info_offload.php?href='.$href.'&g='.$i.'&n='.$name.'&s='.$server.'&z=50';
	//$url = '../sc/exist_multi_info_offload.php?href='.$href.'g='.$i.'&n='.$name.'&s='.$server.'&z=50';
	$ch_1 = curl_init($url);
	curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch_1, CURLOPT_TIMEOUT, 10 );
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
	curl_multi_remove_handle($mh, $ch[$i]);
	$resp=curl_multi_getcontent($ch[$i]);
	$data[] = json_decode($resp);	
}
curl_multi_close($mh);
$aft = microtime(TRUE) - $bef;
//echo $aft;
header('Content-Type: application/json');
header('Duration: '.$aft);
//echo json_encode(array("limit"=>$limit,"gal"=>$gal,'time'=>$aft));
echo json_encode(array('data'=>$data,'time'=>$aft,'start'=>$start,'size'=>$size));
?>