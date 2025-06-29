<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Accept");

include("../db.php");

// Obtener el contenido JSON del cuerpo de la solicitud
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "JSON inválido: " . json_last_error_msg()
    ]);
    exit;
}

$dni = trim($data["dni"] ?? "");
$nombre = trim($data["nombre_completo"] ?? "");

// Validaciones
if (empty($dni) || empty($nombre)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "DNI y nombre son obligatorios"
    ]);
    exit;
}

try {
    // Verificar si el usuario ya existe
    $stmt = $conn->prepare("SELECT * FROM Usuarios WHERE dni = ?");
    $stmt->bind_param("s", $dni);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $usuario = $result->fetch_assoc();
        
        // Verificar coincidencia de nombre
        if (strtolower($usuario['nombre_completo']) !== strtolower($nombre)) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "El nombre no coincide con el registrado para este DNI"
            ]);
            exit;
        }

        echo json_encode($usuario);
        exit;
    }

    // Registrar nuevo usuario
    $insert = $conn->prepare("INSERT INTO Usuarios (nombre_completo, dni) VALUES (?, ?)");
    $insert->bind_param("ss", $nombre, $dni);

    if ($insert->execute()) {
        $usuario = [
            "id" => $insert->insert_id,
            "nombre_completo" => $nombre,
            "dni" => $dni,
            "ha_votado_presidente" => 0,
            "ha_votado_diputado" => 0,
            "ha_votado_alcalde" => 0
        ];
        
        echo json_encode($usuario);
    } else {
        throw new Exception("Error al registrar usuario: " . $conn->error);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($insert)) $insert->close();
    $conn->close();
}
?>
