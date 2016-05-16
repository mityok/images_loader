<?php
include_once("pass.php");
$href = PasswordSingleton::getInstance()->getPassword();
$proxy = PasswordSingleton::getInstance()->getProxy();
$context = NULL;
if($proxy){
		$context = stream_context_create(array('http'=>array('method'=>"GET",'proxy' => $proxy)));
}
$server=isset($_GET['s'])?htmlspecialchars($_GET["s"]):0;
$name=isset($_GET['n'])?htmlspecialchars($_GET["n"]):'img';
$gal=isset($_GET['g'])?htmlspecialchars($_GET["g"]):5;
$count=isset($_GET['c'])?htmlspecialchars($_GET["c"]):1;
$thumb=isset($_GET['m'])?htmlspecialchars($_GET["m"]):1;
$thumb = ($thumb==1)?"tn_":"";
$folder = "thumbs";
$link = "../".$folder.'/'.$name.'/'.$thumb.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", $count ) . '.jpg';
$url = 'http://www.'.$href.($server>0?$server:'').'.com/'.$name.'/'.$thumb.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", $count ) . '.jpg';
header("Content-type: image/jpeg");
if(file_exists($link) && @getimagesize($link)){
	header("Folder: true");
	$data = file_get_contents($link);
	echo $data;
}else{
	header("Internet: true");
	$data = file_get_contents($url, false, $context);
	if(!is_dir("../$folder/$name")) mkdir("../$folder/$name");
	file_put_contents($link, $data);
	echo $data;
}
?>