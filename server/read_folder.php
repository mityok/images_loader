<?php
$page=isset($_GET['q'])?htmlspecialchars($_GET["q"]):NULL;
$server=isset($_GET['r'])?htmlspecialchars($_GET["r"]):NULL;
$before = microtime(true);
$server_folder = "server$server";
$full = "images";
$dr = "thumbs/$server_folder/$page/$full";
header('Content-Type: application/json');
if(!$page){
	echo json_encode(array("message"=>"no page"));
}else{
	$dir = "../$dr";
	$files = array();
	if (file_exists($dir)) {
		$files = scandir($dir);
	}
	$after = microtime(true) - $before;
	header('Duration: '.$after);
	echo json_encode(array('folder'=>$dr,'files'=>$files));
}
?>