<?php
header("Content-Type: application/json");
include("../db.php");

$data = json_decode(file_get_contents("php://input"), true);

$dni = $data["dni"];
$tipo = $data["tipo"];
$candidato_id = $data["candidato_id"];

$buscar = $conn->prepare("SELECT id, ha_votado_presidente, ha_votado_diputados, ha_votado_alcalde FROM Usuarios WHERE dni = ?");
$buscar->bind_param("s", $dni);
$buscar->execute();
$result = $buscar->get_result();
$usuario = $result->fetch_assoc();

if (!$usuario) {
    echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    exit;
}

$usuario_id = $usuario["id"];
$votado = $usuario["ha_votado_" . strtolower($tipo)];

if ($votado) {
    echo json_encode(["status" => "error", "message" => "Ya ha votado por $tipo"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO Votos (usuario_id, tipo, candidato_id) VALUES (?, ?, ?)");
$stmt->bind_param("isi", $usuario_id, $tipo, $candidato_id);
$stmt->execute();

$update = $conn->prepare("UPDATE Usuarios SET ha_votado_" . strtolower($tipo) . " = TRUE WHERE id = ?");
$update->bind_param("i", $usuario_id);
$update->execute();

echo json_encode(["status" => "success", "message" => "Voto registrado"]);
$conn->close();
?>
