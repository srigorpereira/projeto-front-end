// Dados de exemplo para pacientes
let pacientes = [
    {
        id: 1,
        nome: "Maria Silva",
        cpf: "123.456.789-00",
        dataNascimento: "1980-05-15",
        telefone: "(11) 98765-4321",
        ultimaConsulta: "2024-03-10",
        email: "maria.silva@email.com",
        endereco: "Rua das Flores, 123",
        plano: "Unimed",
        status: "Ativo",
        observacoes: "Alérgica a penicilina"
    },
    {
        id: 2,
        nome: "João Santos",
        cpf: "987.654.321-00",
        dataNascimento: "1975-08-20",
        telefone: "(11) 91234-5678",
        ultimaConsulta: "2024-03-12",
        email: "joao.santos@email.com",
        endereco: "Av. Principal, 456",
        plano: "Amil",
        status: "Inativo",
        observacoes: "Hipertenso"
    }
];

// Função para carregar pacientes na tabela
function carregarPacientes() {
    const tbody = document.getElementById('tabelaPacientes');
    tbody.innerHTML = '';

    pacientes.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.className = 'fade-in';
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">
                        ${paciente.nome.charAt(0)}
                    </div>
                    <div>
                        <div class="fw-bold">${paciente.nome}</div>
                        <small class="text-muted">${paciente.email}</small>
                    </div>
                </div>
            </td>
            <td>${paciente.cpf}</td>
            <td>${formatarData(paciente.dataNascimento)}</td>
            <td>${paciente.telefone}</td>
            <td>${formatarData(paciente.ultimaConsulta)}</td>
            <td>
                <span class="badge bg-${paciente.status === 'Ativo' ? 'success' : 'secondary'}">
                    ${paciente.status}
                </span>
            </td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-info" onclick="visualizarHistorico(${paciente.id})" title="Histórico">
                        <i class="fas fa-history"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editarPaciente(${paciente.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirPaciente(${paciente.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
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

// Função para salvar novo paciente
function salvarPaciente() {
    const form = document.getElementById('formCadastroPaciente');
    const formData = new FormData(form);
    
    // Validação básica
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Criar novo paciente
    const novoPaciente = {
        id: pacientes.length + 1,
        nome: formData.get('nome'),
        cpf: formData.get('cpf'),
        dataNascimento: formData.get('dataNascimento'),
        telefone: formData.get('telefone'),
        email: formData.get('email'),
        endereco: formData.get('endereco'),
        plano: formData.get('plano'),
        status: 'Ativo',
        observacoes: formData.get('observacoes'),
        ultimaConsulta: new Date().toISOString().split('T')[0]
    };

    // Adicionar à lista
    pacientes.push(novoPaciente);
    carregarPacientes();
    
    // Fechar modal e limpar formulário
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastroPaciente'));
    modal.hide();
    form.reset();

    // Mostrar notificação de sucesso
    mostrarNotificacao('Paciente cadastrado com sucesso!', 'success');

    // Registrar log de auditoria
    registrarLog('CADASTRO_PACIENTE', `Novo paciente cadastrado: ${novoPaciente.nome}`);
}

// Função para agendar consulta
function agendarConsulta() {
    const form = document.getElementById('formAgendarConsulta');
    const formData = new FormData(form);
    
    // Validação básica
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Criar consulta
    const consulta = {
        paciente: formData.get('paciente'),
        medico: formData.get('medico'),
        data: formData.get('data'),
        horario: formData.get('horario'),
        tipo: formData.get('tipo'),
        observacoes: formData.get('observacoes')
    };

    // Fechar modal e limpar formulário
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgendarConsulta'));
    modal.hide();
    form.reset();

    // Mostrar notificação de sucesso
    mostrarNotificacao('Consulta agendada com sucesso!', 'success');

    // Registrar log de auditoria
    registrarLog('AGENDAMENTO_CONSULTA', `Consulta agendada para ${consulta.data} às ${consulta.horario}`);

    // Notificar paciente
    notificarPaciente(consulta);
}

// Função para visualizar histórico clínico
function visualizarHistorico(pacienteId) {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (paciente) {
        // Aqui você implementaria a lógica para carregar e exibir o histórico
        mostrarNotificacao(`Visualizando histórico de ${paciente.nome}`, 'info');
    }
}

// Função para editar paciente
function editarPaciente(pacienteId) {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (paciente) {
        // Preencher formulário com dados do paciente
        const form = document.getElementById('formCadastroPaciente');
        form.nome.value = paciente.nome;
        form.cpf.value = paciente.cpf;
        form.dataNascimento.value = paciente.dataNascimento;
        form.telefone.value = paciente.telefone;
        form.email.value = paciente.email;
        form.endereco.value = paciente.endereco;
        form.plano.value = paciente.plano;
        form.observacoes.value = paciente.observacoes;

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalCadastroPaciente'));
        modal.show();
    }
}

// Função para excluir paciente
function excluirPaciente(pacienteId) {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (paciente) {
        if (confirm(`Tem certeza que deseja excluir o paciente ${paciente.nome}?`)) {
            pacientes = pacientes.filter(p => p.id !== pacienteId);
            carregarPacientes();
            
            // Mostrar notificação de sucesso
            mostrarNotificacao('Paciente excluído com sucesso!', 'success');
            
            // Registrar log de auditoria
            registrarLog('EXCLUSAO_PACIENTE', `Paciente ID ${pacienteId} excluído`);
        }
    }
}

// Função para registrar logs de auditoria
function registrarLog(tipo, mensagem) {
    const log = {
        timestamp: new Date().toISOString(),
        tipo: tipo,
        mensagem: mensagem,
        usuario: JSON.parse(localStorage.getItem('usuarioLogado') || '{}').nome || 'Sistema'
    };
    
    // Aqui você implementaria o envio do log para o backend
    console.log('Log de auditoria:', log);
}

// Função para notificar paciente
function notificarPaciente(consulta) {
    // Aqui você implementaria a lógica de notificação real
    console.log(`Notificação enviada para o paciente sobre consulta em ${consulta.data} às ${consulta.horario}`);
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 position-fixed bottom-0 end-0 m-3`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensagem}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remover toast após ser escondido
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    carregarPacientes();
    
    // Configurar máscara para CPF
    const cpfInput = document.querySelector('input[name="cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value;
            }
        });
    }

    // Configurar máscara para telefone
    const telefoneInput = document.querySelector('input[name="telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                e.target.value = value;
            }
        });
    }

    // Configurar busca de pacientes
    const buscaInput = document.getElementById('buscaPaciente');
    if (buscaInput) {
        buscaInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const pacientesFiltrados = pacientes.filter(p => 
                p.nome.toLowerCase().includes(termo) || 
                p.cpf.includes(termo) ||
                p.email.toLowerCase().includes(termo)
            );
            carregarPacientesFiltrados(pacientesFiltrados);
        });
    }

    // Configurar filtros
    const filtroStatus = document.querySelector('select[name="status"]');
    const filtroPlano = document.querySelector('select[name="plano"]');
    const btnFiltrar = document.querySelector('button[title="Filtrar"]');

    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', () => {
            const status = filtroStatus?.value || '';
            const plano = filtroPlano?.value || '';
            
            const pacientesFiltrados = pacientes.filter(p => 
                (!status || p.status === status) &&
                (!plano || p.plano === plano)
            );
            
            carregarPacientesFiltrados(pacientesFiltrados);
        });
    }
});

// Função para carregar pacientes filtrados
function carregarPacientesFiltrados(pacientesFiltrados) {
    const tbody = document.getElementById('tabelaPacientes');
    tbody.innerHTML = '';

    pacientesFiltrados.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.className = 'fade-in';
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">
                        ${paciente.nome.charAt(0)}
                    </div>
                    <div>
                        <div class="fw-bold">${paciente.nome}</div>
                        <small class="text-muted">${paciente.email}</small>
                    </div>
                </div>
            </td>
            <td>${paciente.cpf}</td>
            <td>${formatarData(paciente.dataNascimento)}</td>
            <td>${paciente.telefone}</td>
            <td>${formatarData(paciente.ultimaConsulta)}</td>
            <td>
                <span class="badge bg-${paciente.status === 'Ativo' ? 'success' : 'secondary'}">
                    ${paciente.status}
                </span>
            </td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-info" onclick="visualizarHistorico(${paciente.id})" title="Histórico">
                        <i class="fas fa-history"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editarPaciente(${paciente.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirPaciente(${paciente.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
} 