<?php
$bef = microtime(TRUE);
$q = htmlspecialchars($_GET["q"]);
//
$mh = curl_multi_init();
$ch = array();
$response = array();
$size = 40;
for($i=0;$i<$size;$i++){
	$url ='http://localhost/images_load/exist_sngl.php?q='.($i+1).'&g='.$q;
	$ch_1 = curl_init($url);
	curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch_1, CURLOPT_TIMEOUT, 10 );
	// build the multi-curl handle, adding both $ch
	curl_multi_add_handle($mh, $ch_1);
	$ch[]=$ch_1;
}
// execute all queries simultaneously, and continue when all are complete
  $running = null;
  do {
    curl_multi_exec($mh, $running);
  } while ($running);
$limit = -1;
for($i=0;$i<$size;$i++){
	curl_multi_remove_handle($mh, $ch[$i]);
	$response[] = $resp=curl_multi_getcontent($ch[$i]);
	//echo $resp;
	if($resp){
		$limit = $i;
	}
}
curl_multi_close($mh);
//var_dump( $response);
//

$aft =  microtime(TRUE)-$bef;
header('Content-Type: application/json');
header('Duration: '.$aft);
echo '{"limit":'.$limit.'}';
//echo json_encode(array('limit' => $limit));
?>