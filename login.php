<?php

session_start();

// Conectar ao SQLite
function get_db_connection() {
    $conn = new SQLite3('manlib.db');
    return $conn;
}

// Verifica login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'], $_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    $conn = get_db_connection();
    $stmt = $conn->prepare('SELECT estudante_id, senha_hash FROM estudantes WHERE email = :email');
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    $user = $result->fetchArray(SQLITE3_ASSOC);
    if ($user && password_verify($password, $user['senha_hash'])) {
        $_SESSION['user_id'] = $user['estudante_id'];
        $_SESSION['logged_in'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = "Email ou senha incorretos.";
    }
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>Log In</title>
</head>
<body>
    <h2>Log In</h2>
    <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
    <form method="POST" action="index.php?route=login">
        <input type="email" name="email" required placeholder="Digite seu email" />
        <input type="password" name="password" required placeholder="Digite sua senha" />
        <button type="submit">Entrar</button>
    </form>
</body>
</html>
