<?php

session_start();

// Conectar ao SQLite
function get_db_connection() {
    $conn = new SQLite3('manlib.db');
    return $conn;
}

// Página inicial
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['route'])) {
    include 'home.php';
    exit;
}

$route = $_GET['route'] ?? '';

switch ($route) {
    case 'login':
        include 'login.php';
        break;
    case 'logout':
        session_destroy();
        header('Location: index.php');
        break;
    case 'livros':
        include 'livros.php';
        break;
    default:
        echo "<h1>Página não encontrada</h1>";
}

?>
