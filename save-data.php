<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $file = 'data.json';
    $currentData = json_decode(file_get_contents($file), true);
    
    if (!is_array($currentData)) {
        $currentData = [];
    }

    $newRow = [
        $data['waktu'],
        $data['jari1'],
        $data['jari2'],
        $data['jari3'],
        $data['jari4'],
        $data['jari5']
    ];

    $currentData[] = $newRow;
    file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT));
}
?>
