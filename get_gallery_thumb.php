<?php
include_once("pass.php");
$href = PasswordSingleton::getInstance()->getPassword();
$server=isset($_GET['s'])?htmlspecialchars($_GET["s"]):0;
$name=isset($_GET['n'])?htmlspecialchars($_GET["n"]):'img';
$gal=isset($_GET['g'])?htmlspecialchars($_GET["g"]):5;
$count=isset($_GET['c'])?htmlspecialchars($_GET["c"]):1;

$folder = "thumbs";
$link = $folder.'/'.$name.'/tn_'.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", $count ) . '.jpg';
$url = 'http://www.'.$href.($server>0?$server:'').'.com/'.$name.'/tn_'.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", $count ) . '.jpg';
//die("$href/$name$ending");
header("Content-type: image/jpeg");
if(file_exists($link) && @getimagesize($link)){
	header("Folder: true");
	$data = file_get_contents($link);
	echo $data;
}else{
	header("Internet: true");
	$data = file_get_contents($url);
	if(!is_dir("$folder/$name")) mkdir("$folder/$name");
	file_put_contents($link, $data);
	echo $data;
}
?>