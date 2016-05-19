<?php
$page=isset($_GET['q'])?htmlspecialchars($_GET["q"]):NULL;
$server=isset($_GET['r'])?htmlspecialchars($_GET["r"]):NULL;
$server_folder = "server$server";
$full = "images";
$dr = "thumbs/$server_folder/$page/$full";
if(!$page){
	echo json_encode(array("message"=>"no page"));
}else{
	$dir = "../$dr";
	$files = scandir($dir);
	echo json_encode(array('folder'=>$dr,'files'=>$files));
}
?>