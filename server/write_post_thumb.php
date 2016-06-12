<?php
include_once("pass.php");
$link = $_POST['link'];
$url = $_POST['url'];
$dir = $_POST['dir'];
$proxy = PasswordSingleton::getInstance()->getProxy();
$data = file_get_contents($url, false, $proxy ? stream_context_create(array('http'=>array('method'=>"GET",'proxy' => $proxy))) : NULL);
if(!is_dir($dir)){
	mkdir($dir, 0777, true);
}
list($width, $height, $type, $attr) = getimagesize($url);
if($data && $width > 0 && $height > 0){
	file_put_contents($link, $data);
}
?>