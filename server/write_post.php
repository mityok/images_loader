<?php
$before = microtime(true);
$postdata = file_get_contents("php://input");
header('Content-Type: application/json');
$message = "OK";
$dir = "database/";
$file = "dump.txt";
$filename = "$dir$file";
if (file_exists($filename)) {
	//do backup
	$date = date("Y-M-d-H-m-s", filemtime($filename)).'-'.sprintf("%03s", rand(0, 999));
	$pieces = explode(".", $file);
	rename($filename, $dir.$pieces[0]."-$date.".$pieces[1]);
}else{
	if(!is_dir($dir)){
		mkdir($dir, 0777, true);
	}
}
if($postdata){
	$resp = file_put_contents($filename, base64_encode($postdata));
	if (empty($resp)) {
		$message = "FILE ERROR";
	}
}else{
	$message = "DATA ERROR";
}
$after = microtime(true) - $before;
header('Duration: '.$after);
echo json_encode(array(
	'duration' => $after,
	'message' => $message
));
?>