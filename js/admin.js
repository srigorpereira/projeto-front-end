// Configurações do sistema
const config = {
    apiUrl: 'http://localhost:3000/api',
    unidades: ['Hospital', 'Clínica', 'Laboratório', 'Home Care'],
    especialidades: ['Médico', 'Enfermeiro', 'Técnico'],
    status: ['Ativo', 'Inativo', 'Em Férias', 'Afastado']
};

// Funções de Autenticação e Segurança
class Auth {
    static async login(email, senha) {
        try {
            const response = await fetch(`${config.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        }
    }

    static logout() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static getToken() {
        return localStorage.getItem('token');
    }
}

// Funções de Gestão de Unidades
class Unidades {
    static async listar() {
        try {
            const response = await fetch(`${config.apiUrl}/unidades`, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar unidades:', error);
            return [];
        }
    }

    static async cadastrar(unidade) {
        try {
            const response = await fetch(`${config.apiUrl}/unidades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify(unidade)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao cadastrar unidade:', error);
            return null;
        }
    }
}

// Funções de Gestão de Pacientes
class Pacientes {
    static async listar() {
        try {
            const response = await fetch(`${config.apiUrl}/pacientes`, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar pacientes:', error);
            return [];
        }
    }

    static async cadastrar(paciente) {
        try {
            const response = await fetch(`${config.apiUrl}/pacientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify(paciente)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao cadastrar paciente:', error);
            return null;
        }
    }

    static async buscarPorCPF(cpf) {
        try {
            const response = await fetch(`${config.apiUrl}/pacientes/cpf/${cpf}`, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar paciente:', error);
            return null;
        }
    }
}

// Funções de Gestão de Profissionais
class Profissionais {
    static async listar() {
        try {
            const response = await fetch(`${config.apiUrl}/profissionais`, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar profissionais:', error);
            return [];
        }
    }

    static async cadastrar(profissional) {
        try {
            const response = await fetch(`${config.apiUrl}/profissionais`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify(profissional)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao cadastrar profissional:', error);
            return null;
        }
    }
}

// Funções de Telemedicina
class Telemedicina {
    static async listarConsultas() {
        try {
            const response = await fetch(`${config.apiUrl}/telemedicina/consultas`, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar consultas:', error);
            return [];
        }
    }

    static async agendarConsulta(consulta) {
        try {
            const response = await fetch(`${config.apiUrl}/telemedicina/consultas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify(consulta)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao agendar consulta:', error);
            return null;
        }
    }

    static async iniciarConsulta(id) {
        try {
            const response = await fetch(`${config.apiUrl}/telemedicina/consultas/${id}/iniciar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao iniciar consulta:', error);
            return null;
        }
    }
}

// Funções de Auditoria
class Auditoria {
    static async listarLogs() {
        try {
            const response = await fetch(`${config.apiUrl}/auditoria/logs`, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar logs:', error);
            return [];
        }
    }

    static async registrarLog(acao, modulo, detalhes) {
        try {
            const response = await fetch(`${config.apiUrl}/auditoria/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    acao,
                    modulo,
                    detalhes,
                    ip: await this.getIP()
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao registrar log:', error);
            return null;
        }
    }

    static async getIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Erro ao obter IP:', error);
            return '0.0.0.0';
        }
    }
}

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados iniciais
    await carregarUnidades();
    await carregarPacientes();
    await carregarProfissionais();
    await carregarTeleconsultas();
    await carregarLogs();

    // Configurar event listeners
    configurarEventListeners();
});

// Funções de carregamento de dados
async function carregarUnidades() {
    const unidades = await Unidades.listar();
    const tbody = document.getElementById('tabelaUnidades');
    tbody.innerHTML = unidades.map(unidade => `
        <tr>
            <td>${unidade.nome}</td>
            <td>${unidade.tipo}</td>
            <td>${unidade.status}</td>
            <td>${unidade.capacidade}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarUnidade(${unidade.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirUnidade(${unidade.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function carregarPacientes() {
    const pacientes = await Pacientes.listar();
    const tbody = document.getElementById('tabelaPacientes');
    tbody.innerHTML = pacientes.map(paciente => `
        <tr>
            <td>${paciente.id}</td>
            <td>${paciente.nome}</td>
            <td>${paciente.cpf}</td>
            <td>${paciente.unidade}</td>
            <td>${paciente.ultimaConsulta}</td>
            <td>${paciente.status}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarPaciente(${paciente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="visualizarProntuario(${paciente.id})">
                    <i class="fas fa-file-medical"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function carregarProfissionais() {
    const profissionais = await Profissionais.listar();
    const tbody = document.getElementById('tabelaProfissionais');
    tbody.innerHTML = profissionais.map(profissional => `
        <tr>
            <td>${profissional.id}</td>
            <td>${profissional.nome}</td>
            <td>${profissional.especialidade}</td>
            <td>${profissional.unidade}</td>
            <td>${profissional.status}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarProfissional(${profissional.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="visualizarAgenda(${profissional.id})">
                    <i class="fas fa-calendar"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function carregarTeleconsultas() {
    const consultas = await Telemedicina.listarConsultas();
    const tbody = document.getElementById('tabelaTeleconsultas');
    tbody.innerHTML = consultas.map(consulta => `
        <tr>
            <td>${consulta.dataHora}</td>
            <td>${consulta.paciente}</td>
            <td>${consulta.profissional}</td>
            <td>${consulta.status}</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="iniciarConsulta(${consulta.id})">
                    <i class="fas fa-video"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="cancelarConsulta(${consulta.id})">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function carregarLogs() {
    const logs = await Auditoria.listarLogs();
    const tbody = document.getElementById('tabelaAuditoria');
    tbody.innerHTML = logs.map(log => `
        <tr>
            <td>${log.dataHora}</td>
            <td>${log.usuario}</td>
            <td>${log.acao}</td>
            <td>${log.modulo}</td>
            <td>${log.ip}</td>
            <td>${log.detalhes}</td>
        </tr>
    `).join('');
}

// Configuração de event listeners
function configurarEventListeners() {
    // Form de nova unidade
    document.getElementById('formUnidade').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const unidade = {
            nome: formData.get('nome'),
            tipo: formData.get('tipo'),
            endereco: formData.get('endereco'),
            capacidade: formData.get('capacidade')
        };
        await Unidades.cadastrar(unidade);
        await carregarUnidades();
        await Auditoria.registrarLog('Cadastro', 'Unidades', `Nova unidade cadastrada: ${unidade.nome}`);
    });

    // Form de novo profissional
    document.getElementById('formNovoProfissional').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const profissional = {
            nome: formData.get('nome'),
            cpf: formData.get('cpf'),
            especialidade: formData.get('especialidade'),
            unidade: formData.get('unidade'),
            email: formData.get('email'),
            senha: formData.get('senha')
        };
        await Profissionais.cadastrar(profissional);
        await carregarProfissionais();
        await Auditoria.registrarLog('Cadastro', 'Profissionais', `Novo profissional cadastrado: ${profissional.nome}`);
    });
}

// Funções de manipulação de dados
async function editarUnidade(id) {
    // Implementar edição de unidade
}

async function excluirUnidade(id) {
    // Implementar exclusão de unidade
}

async function editarPaciente(id) {
    // Implementar edição de paciente
}

async function visualizarProntuario(id) {
    // Implementar visualização de prontuário
}

async function editarProfissional(id) {
    // Implementar edição de profissional
}

async function visualizarAgenda(id) {
    // Implementar visualização de agenda
}

async function iniciarConsulta(id) {
    const consulta = await Telemedicina.iniciarConsulta(id);
    if (consulta) {
        window.location.href = `teleconsulta.html?id=${id}`;
    }
}

async function cancelarConsulta(id) {
    // Implementar cancelamento de consulta
} 