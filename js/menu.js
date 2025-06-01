document.addEventListener('DOMContentLoaded', function() {
    // Adiciona classe active ao link do menu atual
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.nav-link');
    
    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Inicializa o dropdown do usuário
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        new bootstrap.Dropdown(userDropdown);
    }
}); 