<?php
include_once("pass.php");
$link = isset($_POST['link'])?$_POST['link']:$_GET['link'];
$url = isset($_POST['url'])?$_POST['url']:$_GET['url'];
$dir = isset($_POST['dir'])?$_POST['dir']:$_GET['dir'];
$proxy = PasswordSingleton::getInstance()->getProxy();
$data = file_get_contents($url, false, $proxy ? stream_context_create(array('http'=>array('method'=>"GET",'proxy' => $proxy))) : NULL);
if(!is_dir($dir)){
	mkdir($dir, 0777, true);
}
if($data ){
	file_put_contents($link, $data);
	list($width, $height, $type, $attr) = getimagesize($link);
	echo $width.':'.$height;
	if($width < 0 || $height < 0){
		unlink($link);
	}
}
?>