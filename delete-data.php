<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $file = 'data.json';
    file_put_contents($file, json_encode([]));
}
?>
