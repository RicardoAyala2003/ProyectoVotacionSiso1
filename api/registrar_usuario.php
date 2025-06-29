<?php
header("Content-Type: application/json");
include("../db.php");

$data = json_decode(file_get_contents("php://input"), true);

$dni = trim($data["dni"] ?? "");
$nombre = trim($data["nombre_completo"] ?? "");

// Validar campos
if (!$dni || !$nombre) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "DNI y nombre son obligatorios"]);
    exit;
}

// Verificar si el usuario ya existe
$stmt = $conn->prepare("SELECT * FROM Usuarios WHERE dni = ?");
$stmt->bind_param("s", $dni);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    echo json_encode($usuario);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Registrar nuevo usuario
$insert = $conn->prepare("INSERT INTO Usuarios (nombre_completo, dni) VALUES (?, ?)");
$insert->bind_param("ss", $nombre, $dni);

if ($insert->execute()) {
    $id = $insert->insert_id;
    echo json_encode([
        "id" => $id,
        "nombre_completo" => $nombre,
        "dni" => $dni,
        "ha_votado_presidente" => 0,
        "ha_votado_diputado" => 0,
        "ha_votado_alcalde" => 0
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "No se pudo registrar el usuario"]);
}

$insert->close();
$conn->close();
?>
