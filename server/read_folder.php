<?php
$page=isset($_GET['q'])?htmlspecialchars($_GET["q"]):NULL;
if(!$page){
	echo json_encode(array("message"=>"no page"));
}else{
	$dir = "../thumbs/$page";
	$files = scandir($dir);
	echo json_encode($files);
}
?>