<?php
$url = 'http://freelargephotos.com/000186_l.jpg';
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HEADER, false);
$data = curl_exec($curl);
echo $data;
echo '<br>---<br>';
curl_close($curl);
?>