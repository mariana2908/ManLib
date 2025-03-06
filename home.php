<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
</head>
<body>
    <h1>Bem-vindo ao ManLib</h1>
    <?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): ?>
        <p>Olá, usuário!</p>
        <a href="index.php?route=logout">Sair</a>
    <?php else: ?>
        <a href="index.php?route=login">Login</a>
    <?php endif; ?>
</body>
</html>
