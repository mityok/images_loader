<?php
$before = microtime(true);

header('Content-Type: application/json');
$message = "OK";
$dir = "database/";
$file = "dump.txt";
$filename = "$dir$file";
$data = NULL;
if (file_exists($filename)) {
	//get backup
	$resp = file_get_contents($filename);
	if (empty($resp)) {
		$message = "FILE ERROR";
	}else{
		$data = json_decode(base64_decode($resp));
	}
}else{
	$message = "FILE ERROR";
}

$after = microtime(true) - $before;
header('Duration: '.$after);
echo json_encode(array(
	'duration' => $after,
	'message' => $message,
	'data' => $data
));
?>