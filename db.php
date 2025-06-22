<?php
$host = "127.0.0.1";
$user = "root";
$pass = "ricardo123";
$db = "PlataformaVotacion2025";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
