<?php
header('Content-Type: application/json');
$filename = "database/dump.txt";
if (file_exists($filename)) {
	$data = file_get_contents($filename);
	if(empty($data)){
		$message = "FILE ERROR";
		echo json_encode(array('message' => "FILE READ ERROR"));
	}
	$data = base64_decode($data);
	echo $data;
}else{
	echo json_encode(array('message' => "NO FILE ERROR"));
}
?>