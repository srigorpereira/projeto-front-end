// Dados de exemplo para demonstração
const pacientesExemplo = [
    {
        id: 1,
        nome: "Maria Silva",
        dataNascimento: "1985-05-15",
        ultimaConsulta: "2024-03-10"
    },
    {
        id: 2,
        nome: "João Santos",
        dataNascimento: "1978-11-23",
        ultimaConsulta: "2024-03-12"
    }
];

// Dados de exemplo
const dadosExemplo = {
    funcionarios: [
        {
            id: 1,
            nome: "Dr. Carlos Silva",
            cargo: "Médico",
            departamento: "Clínica Geral",
            status: "Ativo"
        },
        {
            id: 2,
            nome: "Dra. Ana Santos",
            cargo: "Enfermeira",
            departamento: "UTI",
            status: "Ativo"
        }
    ],
    teleconsultas: [
        {
            id: 1,
            horario: "2024-03-15T14:00",
            paciente: "Maria Silva",
            medico: "Dr. Carlos Silva",
            status: "Agendada"
        }
    ],
    estoque: [
        {
            id: 1,
            produto: "Paracetamol 500mg",
            quantidade: 1000,
            minimo: 200,
            status: "Normal"
        },
        {
            id: 2,
            produto: "Seringa 10ml",
            quantidade: 500,
            minimo: 300,
            status: "Atenção"
        }
    ],
    notasFiscais: [
        {
            id: 1,
            numero: "NF-001",
            data: "2024-03-01",
            valor: 15000.00,
            status: "Paga"
        }
    ]
};

// Função para carregar pacientes na tabela
function carregarPacientes() {
    const tbody = document.getElementById('tabelaPacientes');
    tbody.innerHTML = '';

    pacientesExemplo.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${paciente.id}</td>
            <td>${paciente.nome}</td>
            <td>${formatarData(paciente.dataNascimento)}</td>
            <td>${formatarData(paciente.ultimaConsulta)}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="visualizarPaciente(${paciente.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning me-1" onclick="editarPaciente(${paciente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirPaciente(${paciente.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Funções de manipulação de pacientes
function visualizarPaciente(id) {
    alert(`Visualizando paciente ${id}`);
    // Implementar lógica de visualização
}

function editarPaciente(id) {
    alert(`Editando paciente ${id}`);
    // Implementar lógica de edição
}

function excluirPaciente(id) {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
        alert(`Paciente ${id} excluído`);
        // Implementar lógica de exclusão
    }
}

// Gerenciamento do Modal de Login
document.getElementById('btnLogin').addEventListener('click', () => {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    // Implementar lógica de autenticação
    console.log('Tentativa de login:', { email, senha });
    alert('Login realizado com sucesso!');
    
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarPacientes();
    
    // Adicionar animação aos cards
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('fade-in');
    });
});

// Função para busca de pacientes
document.querySelector('input[placeholder="Buscar paciente..."]').addEventListener('input', (e) => {
    const termoBusca = e.target.value.toLowerCase();
    const pacientesFiltrados = pacientesExemplo.filter(paciente => 
        paciente.nome.toLowerCase().includes(termoBusca)
    );
    
    const tbody = document.getElementById('tabelaPacientes');
    tbody.innerHTML = '';
    
    pacientesFiltrados.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${paciente.id}</td>
            <td>${paciente.nome}</td>
            <td>${formatarData(paciente.dataNascimento)}</td>
            <td>${formatarData(paciente.ultimaConsulta)}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="visualizarPaciente(${paciente.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning me-1" onclick="editarPaciente(${paciente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirPaciente(${paciente.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
});

// Funções de Gestão de Funcionários
function carregarFuncionarios() {
    const tbody = document.getElementById('tabelaFuncionarios');
    tbody.innerHTML = '';

    dadosExemplo.funcionarios.forEach(funcionario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${funcionario.id}</td>
            <td>${funcionario.nome}</td>
            <td>${funcionario.cargo}</td>
            <td>${funcionario.departamento}</td>
            <td><span class="badge bg-success">${funcionario.status}</span></td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="visualizarFuncionario(${funcionario.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning me-1" onclick="editarFuncionario(${funcionario.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirFuncionario(${funcionario.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funções de Telemedicina
function carregarTeleconsultas() {
    const tbody = document.getElementById('tabelaTeleconsultas');
    tbody.innerHTML = '';

    dadosExemplo.teleconsultas.forEach(consulta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarDataHora(consulta.horario)}</td>
            <td>${consulta.paciente}</td>
            <td>${consulta.medico}</td>
            <td><span class="badge bg-info">${consulta.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="iniciarTeleconsulta(${consulta.id})">
                    <i class="fas fa-video"></i> Iniciar
                </button>
                <button class="btn btn-sm btn-danger" onclick="cancelarTeleconsulta(${consulta.id})">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funções de Administração
function carregarEstoque() {
    const tbody = document.getElementById('tabelaEstoque');
    tbody.innerHTML = '';

    dadosExemplo.estoque.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.produto}</td>
            <td>${item.quantidade}</td>
            <td>${item.minimo}</td>
            <td><span class="badge ${item.status === 'Normal' ? 'bg-success' : 'bg-warning'}">${item.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function carregarNotasFiscais() {
    const tbody = document.getElementById('tabelaNotasFiscais');
    tbody.innerHTML = '';

    dadosExemplo.notasFiscais.forEach(nota => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nota.numero}</td>
            <td>${formatarData(nota.data)}</td>
            <td>R$ ${nota.valor.toFixed(2)}</td>
            <td><span class="badge bg-success">${nota.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Funções Auxiliares
function formatarDataHora(dataString) {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
}

// Event Listeners
document.getElementById('btnRegistro').addEventListener('click', () => {
    const registroModal = new bootstrap.Modal(document.getElementById('registroModal'));
    registroModal.show();
});

document.getElementById('registroForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('emailRegistro').value;
    const senha = document.getElementById('senhaRegistro').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const tipoUsuario = document.getElementById('tipoUsuario').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Implementar lógica de registro
    console.log('Registro:', { nome, email, tipoUsuario });
    alert('Usuário registrado com sucesso!');
    
    const registroModal = bootstrap.Modal.getInstance(document.getElementById('registroModal'));
    registroModal.hide();
});

document.getElementById('formTeleconsulta').addEventListener('submit', (e) => {
    e.preventDefault();
    // Implementar lógica de agendamento de teleconsulta
    alert('Teleconsulta agendada com sucesso!');
});

// Funções de Manipulação
function visualizarFuncionario(id) {
    alert(`Visualizando funcionário ${id}`);
}

function editarFuncionario(id) {
    alert(`Editando funcionário ${id}`);
}

function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        alert(`Funcionário ${id} excluído`);
    }
}

function iniciarTeleconsulta(id) {
    alert(`Iniciando teleconsulta ${id}`);
}

function cancelarTeleconsulta(id) {
    if (confirm('Tem certeza que deseja cancelar esta teleconsulta?')) {
        alert(`Teleconsulta ${id} cancelada`);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarFuncionarios();
    carregarTeleconsultas();
    carregarEstoque();
    carregarNotasFiscais();
    
    // Adicionar animação aos cards
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('fade-in');
    });
}); 