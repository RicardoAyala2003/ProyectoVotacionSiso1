<?php
header("Content-Type: application/json");
include("../db.php");

$data = json_decode(file_get_contents("php://input"), true);
$nombre = $data["nombre_completo"];
$dni = $data["dni"];

$stmt = $conn->prepare("INSERT INTO Usuarios (nombre_completo, dni) VALUES (?, ?)");
$stmt->bind_param("ss", $nombre, $dni);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Usuario registrado"]);
} else {
    echo json_encode(["status" => "error", "message" => "DNI ya existe o error de inserción"]);
}

$stmt->close();
$conn->close();
?>
