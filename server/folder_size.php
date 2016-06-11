<?php
header('Content-Type: application/json');
$size = NULL;
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
	$size = formatSize(disk_free_space("/"));
} else {
	$size = formatSize(disk_free_space("/mnt/extSdCard"));
}
echo json_encode(array(
	'size' => $size
));
function formatSize( $bytes ){
        $types = array( 'B', 'KB', 'MB', 'GB', 'TB' );
        for( $i = 0; $bytes >= 1024 && $i < ( count( $types ) -1 ); $bytes /= 1024, $i++ );
                return( round( $bytes, 2 ) . " " . $types[$i] );
}
?>