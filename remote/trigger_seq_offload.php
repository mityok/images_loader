<?php
//header('Access-Control-Allow-Origin: http://localhost');
//header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
//header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
//header('Access-Control-Allow-Credentials: true');
ini_set('max_execution_time', 3000);
//0 - 64.159.87.116 64.159.87.100
//2 - 64.159.87.109 64.159.87.115
//3 - 64.158.31.141 64.158.31.140
//4 - 64.158.31.143 64.158.31.142
//search - 64.158.31.148
$limit = (int)htmlspecialchars($_GET["l"]);
$start = (int)htmlspecialchars($_GET["b"]);
$page = (int)htmlspecialchars($_GET["p"]);
$server = htmlspecialchars($_GET["s"]);
$name = htmlspecialchars($_GET["n"]);
$href = isset($_GET['href'])?htmlspecialchars($_GET["href"]):'';
$bef = microtime(TRUE);
//
$mh = curl_multi_init();
$ch = array();

$list = array();
for ($i = $start; $i < min($start+$page,$limit+1); $i++) {
	$r=NULL;
	$resp =NULL;
	if($i>0){
		$url = 'http://mityok.hostfree.pw/sc/exist_multi_info_offload.php?href='.$href.'&g='.$i.'&n='.$name.'&s='.$server.'&z=50';
		$r = @file_get_contents($url);
		$resp = json_decode($r);
		$data[] = $resp;
		usleep(1000);
	}	
	//$list[$i] = ($r && $resp)?($resp -> limit):null;
	$list[] = ($r && $resp)?($resp -> limit):null;
}

$aft = microtime(TRUE) - $bef;
//echo $aft;
header('Content-Type: application/json');
header('Duration: '.$aft);

//echo json_encode(array('data'=>$data, 'list'=>$list,'time'=>$aft));
echo json_encode(array('list'=>$list,'time'=>$aft,'src'=>$name,'server'=>$server,'start'=>$start,'limit'=>$limit));
?>