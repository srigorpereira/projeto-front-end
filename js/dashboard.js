// Dados de exemplo para próximas consultas
const proximasConsultas = [
    {
        horario: "2024-03-15T14:00",
        paciente: "Maria Silva",
        medico: "Dr. Carlos Silva",
        status: "Confirmada"
    },
    {
        horario: "2024-03-15T15:30",
        paciente: "João Santos",
        medico: "Dra. Ana Santos",
        status: "Pendente"
    },
    {
        horario: "2024-03-15T16:00",
        paciente: "Pedro Oliveira",
        medico: "Dr. Carlos Silva",
        status: "Confirmada"
    }
];

// Função para carregar próximas consultas
function carregarProximasConsultas() {
    const tbody = document.getElementById('tabelaProximasConsultas');
    tbody.innerHTML = '';

    proximasConsultas.forEach(consulta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarDataHora(consulta.horario)}</td>
            <td>${consulta.paciente}</td>
            <td>${consulta.medico}</td>
            <td>
                <span class="badge ${consulta.status === 'Confirmada' ? 'bg-success' : 'bg-warning'}">
                    ${consulta.status}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para formatar data e hora
function formatarDataHora(dataString) {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });
}

// Verificar autenticação
function verificarAutenticacao() {
    // Aqui você implementaria a verificação real de autenticação
    // Por enquanto, vamos apenas simular
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = 'login.html';
    }
}

// Função para fazer logout
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarProximasConsultas();
    
    // Adicionar animação aos cards
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('fade-in');
    });

    // Configurar dropdown de usuário
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        userDropdown.innerHTML = `<i class="fas fa-user-circle"></i> ${usuarioLogado.nome || 'Usuário'}`;
    }
}); 