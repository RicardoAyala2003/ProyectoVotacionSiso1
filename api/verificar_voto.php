<?php
header("Content-Type: application/json");
include("../db.php");

$dni = $_GET["dni"];
$sql = "SELECT ha_votado_presidente, ha_votado_diputados, ha_votado_alcalde FROM Usuarios WHERE dni = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $dni);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo json_encode($user);
} else {
    echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>
