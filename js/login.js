document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    // Verificar credenciais do administrador
    if (email === config.admin.email && senha === config.admin.senha) {
        // Salvar token de autenticação
        localStorage.setItem('token', 'admin-token');
        localStorage.setItem('userType', 'admin');
        
        // Redirecionar para o dashboard
        window.location.href = 'admin.html';
    } else {
        alert('Email ou senha inválidos!');
    }
}); 