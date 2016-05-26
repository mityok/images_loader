<?php
// $df contains the number of bytes available on "/"

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
	echo formatSize(disk_free_space("/")).'<br>';
} else {
	echo formatSize(disk_free_space("/mnt/extSdCard")).'<br>';
}

function formatSize( $bytes ){
        $types = array( 'B', 'KB', 'MB', 'GB', 'TB' );
        for( $i = 0; $bytes >= 1024 && $i < ( count( $types ) -1 ); $bytes /= 1024, $i++ );
                return( round( $bytes, 2 ) . " " . $types[$i] );
}


?>