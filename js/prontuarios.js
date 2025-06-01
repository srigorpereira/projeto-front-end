// Configurações
const config = {
    apiUrl: 'http://localhost:3000/api',
    tiposProntuario: ['Consulta', 'Retorno', 'Urgência', 'Teleconsulta'],
    statusProntuario: ['Em Andamento', 'Finalizado', 'Cancelado']
};

// Classe para gerenciar prontuários
class Prontuarios {
    constructor() {
        this.prontuarios = [];
        this.pacienteAtual = null;
        this.setupEventListeners();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Busca de pacientes
        document.getElementById('btnBuscar').addEventListener('click', () => this.buscarPaciente());
        document.getElementById('buscaPaciente').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.buscarPaciente();
        });

        // Formulário de prontuário
        document.getElementById('formProntuario').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarProntuario();
        });

        // Botões de ação
        document.getElementById('btnVoltar').addEventListener('click', () => this.voltarLista());
        document.getElementById('btnCancelar').addEventListener('click', () => this.cancelarProntuario());

        // Prescrição
        document.getElementById('btnAddMedicamento').addEventListener('click', () => this.adicionarMedicamento());
        document.getElementById('btnAddExame').addEventListener('click', () => this.adicionarExame());
        document.getElementById('btnSalvarPrescricao').addEventListener('click', () => this.salvarPrescricao());

        // Inicialização dos tooltips do Bootstrap
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Gerenciamento do formulário de novo prontuário
        const formNovoProntuario = document.getElementById('formNovoProntuario');
        if (formNovoProntuario) {
            formNovoProntuario.addEventListener('submit', function(e) {
                e.preventDefault();
                // Aqui você pode adicionar a lógica para salvar o prontuário
                alert('Prontuário salvo com sucesso!');
                bootstrap.Modal.getInstance(document.getElementById('modalNovoProntuario')).hide();
            });
        }

        // Gerenciamento do formulário de importação
        const formImportar = document.getElementById('formImportar');
        if (formImportar) {
            formImportar.addEventListener('submit', function(e) {
                e.preventDefault();
                // Aqui você pode adicionar a lógica para importar prontuários
                alert('Prontuários importados com sucesso!');
                bootstrap.Modal.getInstance(document.getElementById('modalImportar')).hide();
            });
        }

        // Gerenciamento do formulário de exportação
        const formExportar = document.getElementById('formExportar');
        if (formExportar) {
            formExportar.addEventListener('submit', function(e) {
                e.preventDefault();
                // Aqui você pode adicionar a lógica para exportar prontuários
                alert('Prontuários exportados com sucesso!');
                bootstrap.Modal.getInstance(document.getElementById('modalExportar')).hide();
            });
        }

        // Função para buscar prontuários
        const inputBusca = document.querySelector('input[placeholder="Buscar prontuário..."]');
        if (inputBusca) {
            inputBusca.addEventListener('input', function(e) {
                const termoBusca = e.target.value.toLowerCase();
                const linhas = document.querySelectorAll('#lista-prontuarios tbody tr');
                
                linhas.forEach(linha => {
                    const texto = linha.textContent.toLowerCase();
                    linha.style.display = texto.includes(termoBusca) ? '' : 'none';
                });
            });
        }

        // Função para filtrar por médico
        const selectMedico = document.querySelector('select:first-of-type');
        if (selectMedico) {
            selectMedico.addEventListener('change', function(e) {
                const medicoSelecionado = e.target.value;
                const linhas = document.querySelectorAll('#lista-prontuarios tbody tr');
                
                linhas.forEach(linha => {
                    const medico = linha.querySelector('td:nth-child(3)').textContent;
                    linha.style.display = !medicoSelecionado || medico.includes(medicoSelecionado) ? '' : 'none';
                });
            });
        }

        // Função para filtrar por especialidade
        const selectEspecialidade = document.querySelector('select:nth-of-type(2)');
        if (selectEspecialidade) {
            selectEspecialidade.addEventListener('change', function(e) {
                const especialidadeSelecionada = e.target.value;
                const linhas = document.querySelectorAll('#lista-prontuarios tbody tr');
                
                linhas.forEach(linha => {
                    const especialidade = linha.querySelector('td:nth-child(4)').textContent;
                    linha.style.display = !especialidadeSelecionada || especialidade.includes(especialidadeSelecionada) ? '' : 'none';
                });
            });
        }

        // Gerenciamento dos botões de ação
        document.querySelectorAll('#lista-prontuarios .btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const acao = this.title.toLowerCase();
                const linha = this.closest('tr');
                const idProntuario = linha.querySelector('td:first-child').textContent;
                
                switch(acao) {
                    case 'editar':
                        // Aqui você pode adicionar a lógica para editar o prontuário
                        alert(`Editando prontuário ${idProntuario}`);
                        break;
                    case 'visualizar':
                        // Aqui você pode adicionar a lógica para visualizar o prontuário
                        alert(`Visualizando prontuário ${idProntuario}`);
                        break;
                    case 'excluir':
                        if (confirm(`Tem certeza que deseja excluir o prontuário ${idProntuario}?`)) {
                            // Aqui você pode adicionar a lógica para excluir o prontuário
                            linha.remove();
                        }
                        break;
                }
            });
        });

        // Atualização das estatísticas
        function atualizarEstatisticas() {
            const totalProntuarios = document.querySelectorAll('#lista-prontuarios tbody tr').length;
            const concluidos = document.querySelectorAll('#lista-prontuarios .bg-success').length;
            const emAndamento = document.querySelectorAll('#lista-prontuarios .bg-warning').length;
            const emRevisao = document.querySelectorAll('#lista-prontuarios .bg-info').length;

            // Aqui você pode atualizar os elementos de estatísticas na página
            console.log(`Total: ${totalProntuarios}, Concluídos: ${concluidos}, Em Andamento: ${emAndamento}, Em Revisão: ${emRevisao}`);
        }

        // Chamar a função de atualização de estatísticas quando necessário
        atualizarEstatisticas();
    }

    // Buscar paciente por nome ou CPF
    async buscarPaciente() {
        const termo = document.getElementById('buscaPaciente').value.trim();
        if (!termo) return;

        try {
            const response = await fetch(`${config.apiUrl}/pacientes/buscar?termo=${termo}`);
            const data = await response.json();

            if (data.success) {
                this.pacienteAtual = data.paciente;
                this.carregarProntuariosPaciente();
                this.mostrarVisualizacao();
            } else {
                alert('Paciente não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar paciente:', error);
            alert('Erro ao buscar paciente');
        }
    }

    // Carregar prontuários do paciente
    async carregarProntuariosPaciente() {
        if (!this.pacienteAtual) return;

        try {
            const response = await fetch(`${config.apiUrl}/prontuarios/${this.pacienteAtual.id}`);
            const data = await response.json();

            if (data.success) {
                this.prontuarios = data.prontuarios;
                this.atualizarTabelaProntuarios();
                this.atualizarHistoricoClinico();
            }
        } catch (error) {
            console.error('Erro ao carregar prontuários:', error);
            alert('Erro ao carregar prontuários');
        }
    }

    // Atualizar tabela de prontuários
    atualizarTabelaProntuarios() {
        const tbody = document.getElementById('tabelaProntuarios');
        tbody.innerHTML = '';

        this.prontuarios.forEach(prontuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(prontuario.data).toLocaleDateString()}</td>
                <td>${this.pacienteAtual.nome}</td>
                <td>${prontuario.profissional}</td>
                <td>${prontuario.tipo}</td>
                <td><span class="badge bg-${this.getStatusColor(prontuario.status)}">${prontuario.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="prontuarios.visualizarProntuario(${prontuario.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="prontuarios.emitirPrescricao(${prontuario.id})">
                        <i class="fas fa-prescription"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Atualizar histórico clínico
    atualizarHistoricoClinico() {
        const container = document.getElementById('historicoClinico');
        container.innerHTML = '';

        this.prontuarios.forEach(prontuario => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${new Date(prontuario.data).toLocaleDateString()} - ${prontuario.tipo}
                    </h6>
                    <p><strong>Queixa Principal:</strong> ${prontuario.queixaPrincipal}</p>
                    <p><strong>História da Doença:</strong> ${prontuario.historiaDoenca}</p>
                    <p><strong>Exame Físico:</strong> ${prontuario.exameFisico}</p>
                    <p><strong>Diagnóstico:</strong> ${prontuario.diagnostico}</p>
                    <p><strong>Conduta:</strong> ${prontuario.conduta}</p>
                    ${prontuario.observacoes ? `<p><strong>Observações:</strong> ${prontuario.observacoes}</p>` : ''}
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Visualizar prontuário específico
    visualizarProntuario(id) {
        const prontuario = this.prontuarios.find(p => p.id === id);
        if (!prontuario) return;

        // Preencher dados do paciente
        document.getElementById('nomePaciente').textContent = this.pacienteAtual.nome;
        document.getElementById('cpfPaciente').textContent = this.pacienteAtual.cpf;
        document.getElementById('dataNascimento').textContent = new Date(this.pacienteAtual.dataNascimento).toLocaleDateString();
        document.getElementById('unidadePaciente').textContent = this.pacienteAtual.unidade;

        // Mostrar seção de visualização
        this.mostrarVisualizacao();
    }

    // Emitir prescrição
    emitirPrescricao(id) {
        const prontuario = this.prontuarios.find(p => p.id === id);
        if (!prontuario) return;

        // Limpar formulário de prescrição
        document.getElementById('listaMedicamentos').innerHTML = '';
        document.getElementById('listaExames').innerHTML = '';
        this.adicionarMedicamento();
        this.adicionarExame();

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalPrescricao'));
        modal.show();
    }

    // Adicionar campo de medicamento
    adicionarMedicamento() {
        const container = document.getElementById('listaMedicamentos');
        const div = document.createElement('div');
        div.className = 'input-group mb-2';
        div.innerHTML = `
            <input type="text" class="form-control" placeholder="Nome do medicamento">
            <input type="text" class="form-control" placeholder="Dosagem">
            <input type="text" class="form-control" placeholder="Frequência">
            <button type="button" class="btn btn-outline-danger" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(div);
    }

    // Adicionar campo de exame
    adicionarExame() {
        const container = document.getElementById('listaExames');
        const div = document.createElement('div');
        div.className = 'input-group mb-2';
        div.innerHTML = `
            <input type="text" class="form-control" placeholder="Nome do exame">
            <button type="button" class="btn btn-outline-danger" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(div);
    }

    // Salvar prescrição
    async salvarPrescricao() {
        const medicamentos = Array.from(document.querySelectorAll('#listaMedicamentos .input-group')).map(group => {
            const inputs = group.querySelectorAll('input');
            return {
                nome: inputs[0].value,
                dosagem: inputs[1].value,
                frequencia: inputs[2].value
            };
        });

        const exames = Array.from(document.querySelectorAll('#listaExames .input-group')).map(group => {
            return {
                nome: group.querySelector('input').value
            };
        });

        try {
            const response = await fetch(`${config.apiUrl}/prescricoes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pacienteId: this.pacienteAtual.id,
                    medicamentos,
                    exames
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Prescrição salva com sucesso');
                bootstrap.Modal.getInstance(document.getElementById('modalPrescricao')).hide();
            } else {
                alert('Erro ao salvar prescrição');
            }
        } catch (error) {
            console.error('Erro ao salvar prescrição:', error);
            alert('Erro ao salvar prescrição');
        }
    }

    // Salvar novo prontuário
    async salvarProntuario() {
        const form = document.getElementById('formProntuario');
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${config.apiUrl}/prontuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pacienteId: this.pacienteAtual.id,
                    ...dados
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Prontuário salvo com sucesso');
                this.carregarProntuariosPaciente();
                this.voltarLista();
            } else {
                alert('Erro ao salvar prontuário');
            }
        } catch (error) {
            console.error('Erro ao salvar prontuário:', error);
            alert('Erro ao salvar prontuário');
        }
    }

    // Mostrar seção de visualização
    mostrarVisualizacao() {
        document.getElementById('busca').style.display = 'none';
        document.getElementById('prontuarios').style.display = 'none';
        document.getElementById('novoProntuario').style.display = 'none';
        document.getElementById('visualizacao').style.display = 'block';
    }

    // Voltar para lista de prontuários
    voltarLista() {
        document.getElementById('busca').style.display = 'block';
        document.getElementById('prontuarios').style.display = 'block';
        document.getElementById('novoProntuario').style.display = 'none';
        document.getElementById('visualizacao').style.display = 'none';
    }

    // Cancelar novo prontuário
    cancelarProntuario() {
        document.getElementById('formProntuario').reset();
        this.voltarLista();
    }

    // Obter cor do status
    getStatusColor(status) {
        switch (status) {
            case 'Em Andamento':
                return 'warning';
            case 'Finalizado':
                return 'success';
            case 'Cancelado':
                return 'danger';
            default:
                return 'secondary';
        }
    }
}

// Inicializar
const prontuarios = new Prontuarios(); 