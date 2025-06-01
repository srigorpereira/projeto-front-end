// Dados de exemplo para consultas
const consultas = [
    {
        id: 1,
        paciente: "Maria Silva",
        medico: "Dr. Carlos Silva",
        data: "2024-03-15",
        horario: "14:00",
        status: "Agendada",
        tipo: "Telemedicina"
    },
    {
        id: 2,
        paciente: "João Santos",
        medico: "Dra. Ana Santos",
        data: "2024-03-15",
        horario: "15:30",
        status: "Em Andamento",
        tipo: "Telemedicina"
    }
];

// Configurações do WebRTC
const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

// Elementos do DOM
const videoLocal = document.getElementById('videoLocal');
const videoRemote = document.getElementById('videoRemote');
const btnMicrofone = document.getElementById('btnMicrofone');
const btnCamera = document.getElementById('btnCamera');
const btnEncerrar = document.getElementById('btnEncerrar');
const nomePaciente = document.getElementById('nomePaciente');
const nomeProfissional = document.getElementById('nomeProfissional');
const duracaoConsulta = document.getElementById('duracaoConsulta');

// Variáveis de controle
let localStream = null;
let peerConnection = null;
let consultaIniciada = false;
let tempoInicio = null;
let timerInterval = null;

// Função para carregar consultas
function carregarConsultas() {
    const listaConsultas = document.getElementById('listaConsultas');
    listaConsultas.innerHTML = '';

    consultas.forEach(consulta => {
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'list-group-item list-group-item-action';
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${consulta.paciente}</h6>
                <small>${consulta.horario}</small>
            </div>
            <p class="mb-1">Médico: ${consulta.medico}</p>
            <small class="text-${consulta.status === 'Em Andamento' ? 'success' : 'primary'}">
                ${consulta.status}
            </small>
        `;
        item.onclick = () => iniciarConsulta(consulta);
        listaConsultas.appendChild(item);
    });
}

// Função para iniciar consulta
async function iniciarConsulta(consulta) {
    try {
        // Solicitar permissões de mídia
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        // Exibir vídeo local
        videoLocal.srcObject = localStream;

        // Atualizar interface
        nomePaciente.textContent = consulta.paciente;
        nomeProfissional.textContent = consulta.medico;
        consultaIniciada = true;
        tempoInicio = new Date();
        timerInterval = setInterval(atualizarTempo, 1000);

        // Registrar log de auditoria
        registrarLog('INICIO_CONSULTA', `Consulta iniciada com ${consulta.paciente}`);

        // Aqui você implementaria a lógica de conexão WebRTC real
        console.log('Iniciando chamada com:', consulta.paciente);

        // Inicializar WebRTC
        await iniciarWebRTC();
    } catch (error) {
        console.error('Erro ao iniciar consulta:', error);
        alert('Erro ao acessar câmera e microfone. Verifique as permissões.');
    }
}

// Função para encerrar consulta
async function encerrarConsulta() {
    if (confirm('Tem certeza que deseja encerrar a consulta?')) {
        // Parar contagem de tempo
        clearInterval(timerInterval);

        // Parar streams de mídia
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        // Fechar conexão peer
        if (peerConnection) {
            peerConnection.close();
        }

        // Registrar encerramento
        await Telemedicina.encerrarConsulta(window.location.search.split('=')[1]);

        // Redirecionar
        window.location.href = 'dashboard.html';
    }
}

// Função para salvar prontuário
async function salvarProntuario(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const prontuario = {
        queixaPrincipal: formData.get('queixaPrincipal'),
        historiaDoenca: formData.get('historiaDoenca'),
        exameFisico: formData.get('exameFisico'),
        diagnostico: formData.get('diagnostico'),
        conduta: formData.get('conduta')
    };

    try {
        await Telemedicina.salvarProntuario(window.location.search.split('=')[1], prontuario);
        alert('Prontuário salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar prontuário:', error);
        alert('Erro ao salvar prontuário');
    }
}

// Função para emitir receita
function emitirReceita() {
    // Aqui você implementaria a lógica para gerar e emitir a receita
    const receita = {
        data: new Date().toISOString(),
        medico: 'Dr. Carlos Silva', // Exemplo
        paciente: document.getElementById('nomePaciente').textContent,
        medicamentos: document.querySelector('textarea[name="prescricao"]').value
    };

    // Registrar log de auditoria
    registrarLog('RECEITA_EMITIDA', `Receita emitida para ${receita.paciente}`);

    // Simular geração de PDF
    alert('Receita gerada com sucesso!');
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

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados da consulta
    await carregarDadosConsulta();

    // Inicializar câmera e microfone
    await inicializarMidia();

    // Configurar event listeners
    configurarEventListeners();

    // Iniciar contagem de tempo
    iniciarContagemTempo();

    // Configurar controles de vídeo
    document.getElementById('startCall').addEventListener('click', () => {
        if (consultaIniciada) {
            iniciarConsulta(consultas.find(c => c.paciente === nomePaciente.textContent));
        }
    });

    document.getElementById('endCall').addEventListener('click', encerrarConsulta);

    document.getElementById('toggleMic').addEventListener('click', function() {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            this.classList.toggle('btn-danger');
        }
    });

    document.getElementById('toggleVideo').addEventListener('click', function() {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            this.classList.toggle('btn-danger');
        }
    });

    document.getElementById('toggleScreen').addEventListener('click', async function() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
            const videoTrack = screenStream.getVideoTracks()[0];
            
            if (peerConnection) {
                const sender = peerConnection.getSenders().find(s => s.track.kind === 'video');
                sender.replaceTrack(videoTrack);
            }

            videoTrack.onended = () => {
                this.classList.remove('btn-danger');
            };

            this.classList.add('btn-danger');
        } catch (error) {
            console.error('Erro ao compartilhar tela:', error);
        }
    });

    // Configurar formulário de prontuário
    document.getElementById('formProntuario').addEventListener('submit', salvarProntuario);
});

// Funções de inicialização
async function carregarDadosConsulta() {
    const urlParams = new URLSearchParams(window.location.search);
    const consultaId = urlParams.get('id');

    if (!consultaId) {
        alert('ID da consulta não fornecido');
        window.location.href = 'dashboard.html';
        return;
    }

    try {
        const consulta = await Telemedicina.buscarConsulta(consultaId);
        if (consulta) {
            nomePaciente.textContent = consulta.paciente.nome;
            nomeProfissional.textContent = consulta.profissional.nome;
            consultaIniciada = true;
        } else {
            alert('Consulta não encontrada');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Erro ao carregar dados da consulta:', error);
        alert('Erro ao carregar dados da consulta');
    }
}

async function inicializarMidia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        videoLocal.srcObject = localStream;
    } catch (error) {
        console.error('Erro ao acessar câmera/microfone:', error);
        alert('Erro ao acessar câmera/microfone. Verifique as permissões.');
    }
}

function configurarEventListeners() {
    // Controles de mídia
    btnMicrofone.addEventListener('click', () => {
        const audioTrack = localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        btnMicrofone.classList.toggle('btn-danger');
    });

    btnCamera.addEventListener('click', () => {
        const videoTrack = localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        btnCamera.classList.toggle('btn-danger');
    });

    btnEncerrar.addEventListener('click', encerrarConsulta);

    // Formulários
    document.getElementById('formProntuario').addEventListener('submit', salvarProntuario);
    document.getElementById('formPrescricao').addEventListener('submit', emitirPrescricao);

    // Botões de adicionar medicamentos e exames
    document.getElementById('btnAddMedicamento').addEventListener('click', adicionarMedicamento);
    document.getElementById('btnAddExame').addEventListener('click', adicionarExame);
}

// Funções de controle de mídia
function iniciarContagemTempo() {
    tempoInicio = new Date();
    timerInterval = setInterval(atualizarTempo, 1000);
}

function atualizarTempo() {
    if (!tempoInicio) return;

    const agora = new Date();
    const diff = agora - tempoInicio;
    const horas = Math.floor(diff / 3600000);
    const minutos = Math.floor((diff % 3600000) / 60000);
    const segundos = Math.floor((diff % 60000) / 1000);

    duracaoConsulta.textContent = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

async function emitirPrescricao(event) {
    event.preventDefault();
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

    const prescricao = {
        medicamentos,
        exames
    };

    try {
        await Telemedicina.emitirPrescricao(window.location.search.split('=')[1], prescricao);
        alert('Prescrição emitida com sucesso!');
    } catch (error) {
        console.error('Erro ao emitir prescrição:', error);
        alert('Erro ao emitir prescrição');
    }
}

// Funções auxiliares
function adicionarMedicamento() {
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

function adicionarExame() {
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

// WebRTC
async function iniciarWebRTC() {
    try {
        peerConnection = new RTCPeerConnection(config);

        // Adicionar stream local
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // Configurar eventos
        peerConnection.ontrack = event => {
            videoRemote.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                // Enviar candidato ICE para o peer remoto
                enviarCandidatoICE(event.candidate);
            }
        };

        // Criar e enviar oferta
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await enviarOferta(offer);

    } catch (error) {
        console.error('Erro ao iniciar WebRTC:', error);
        alert('Erro ao iniciar conexão de vídeo');
    }
}

async function enviarOferta(offer) {
    try {
        const response = await fetch(`${config.apiUrl}/telemedicina/sinal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({
                tipo: 'oferta',
                sinal: offer
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar oferta:', error);
        throw error;
    }
}

async function enviarCandidatoICE(candidate) {
    try {
        await fetch(`${config.apiUrl}/telemedicina/sinal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({
                tipo: 'candidato',
                sinal: candidate
            })
        });
    } catch (error) {
        console.error('Erro ao enviar candidato ICE:', error);
    }
} 