<?php
// CORS: responder preflight primero
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Accept");
    http_response_code(200);
    exit;
}

// CORS para solicitudes reales
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Incluye conexión a la base
include("../db.php");

// Decodificar JSON
$data = json_decode(file_get_contents("php://input"), true);

$dni = $data["dni"] ?? '';
$tipo = ucfirst(strtolower($data["tipo"] ?? ''));
$candidato_id = $data["candidato_id"] ?? null;
$candidatos_ids = $data["candidatos_ids"] ?? null;

if (!$dni || !$tipo || (!$candidato_id && !$candidatos_ids)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

// Buscar usuario
$stmt = $conn->prepare("SELECT id, ha_votado_presidente, ha_votado_diputados, ha_votado_alcalde FROM Usuarios WHERE dni = ?");
$stmt->bind_param("s", $dni);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

if (!$usuario) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    exit;
}

$usuario_id = $usuario["id"];

// Mapeo explícito para la columna correcta en Usuarios
$tipo_lower = strtolower($tipo);
switch ($tipo_lower) {
    case "diputado":
        $votado_key = "ha_votado_diputados";
        break;
    case "presidente":
        $votado_key = "ha_votado_presidente";
        break;
    case "alcalde":
        $votado_key = "ha_votado_alcalde";
        break;
    default:
        $votado_key = "ha_votado_" . $tipo_lower;
}

if (!isset($usuario[$votado_key])) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Columna de voto no encontrada"]);
    exit;
}

if ($usuario[$votado_key]) {
    http_response_code(409);
    echo json_encode(["status" => "error", "message" => "Ya ha votado por $tipo"]);
    exit;
}

// Registrar voto(s)
try {
    if ($tipo === "Diputado" && is_array($candidatos_ids)) {
        $stmt = $conn->prepare("INSERT INTO Votos (usuario_id, tipo, candidato_id) VALUES (?, ?, ?)");
        foreach ($candidatos_ids as $diputado_id) {
            $stmt->bind_param("isi", $usuario_id, $tipo, $diputado_id);
            $stmt->execute();
        }
    } else {
        $stmt = $conn->prepare("INSERT INTO Votos (usuario_id, tipo, candidato_id) VALUES (?, ?, ?)");
        $stmt->bind_param("isi", $usuario_id, $tipo, $candidato_id);
        $stmt->execute();
    }

    // Marcar que ya votó
    $update = $conn->prepare("UPDATE Usuarios SET $votado_key = TRUE WHERE id = ?");
    $update->bind_param("i", $usuario_id);
    $update->execute();

    echo json_encode(["status" => "success", "message" => "Voto registrado"]);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error en la base de datos", "detalle" => $e->getMessage()]);
}

$conn->close();
?>
