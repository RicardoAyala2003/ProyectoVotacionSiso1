<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../db.php'; // usa tu archivo db.php original

$tipo = $_GET['tipo'] ?? '';

if (!$tipo) {
    http_response_code(400);
    echo json_encode(["message" => "Tipo no especificado"]);
    exit;
}

// Construcción de la consulta según el tipo
$consulta = "SELECT c.id, c.nombre_completo, p.nombre AS partido, COUNT(v.id) AS votos";

if ($tipo === 'Alcalde') {
    $consulta .= ", c.municipio";
}

$consulta .= " FROM Votos v 
               JOIN Candidatos c ON v.candidato_id = c.id 
               JOIN Partidos p ON c.partido_id = p.id
               WHERE v.tipo = ?
               GROUP BY c.id";

if ($tipo === 'Alcalde') {
    $consulta .= ", c.municipio";
}

$consulta .= " ORDER BY votos DESC";

$stmt = $conn->prepare($consulta);
$stmt->bind_param("s", $tipo);
$stmt->execute();
$resultado = $stmt->get_result();

$datos = [];
while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

echo json_encode($datos);
