<?php
header("Content-Type: application/json");
include("../db.php");

$tipo = $_GET["tipo"];

$sql = "SELECT c.id, c.nombre_completo, c.tipo, c.departamento, c.municipio, p.nombre AS partido 
        FROM Candidatos c 
        JOIN Partidos p ON c.partido_id = p.id 
        WHERE c.tipo = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $tipo);
$stmt->execute();
$result = $stmt->get_result();

$candidatos = [];
while ($row = $result->fetch_assoc()) {
    $candidatos[] = $row;
}

echo json_encode($candidatos);
$stmt->close();
$conn->close();
?>
