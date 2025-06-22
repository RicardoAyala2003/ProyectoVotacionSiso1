<?php
header("Content-Type: application/json");
include("../db.php");

$tipo = $_GET["tipo"];

$sql = "SELECT c.nombre_completo, p.nombre AS partido, COUNT(v.id) AS total_votos
        FROM Votos v
        JOIN Candidatos c ON v.candidato_id = c.id
        JOIN Partidos p ON c.partido_id = p.id
        WHERE v.tipo = ?
        GROUP BY v.candidato_id
        ORDER BY total_votos DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $tipo);
$stmt->execute();
$result = $stmt->get_result();

$datos = [];
while ($row = $result->fetch_assoc()) {
    $datos[] = $row;
}

echo json_encode($datos);
$stmt->close();
$conn->close();
?>
