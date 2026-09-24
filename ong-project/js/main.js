// main.js - ponto de entrada da aplicação e controle de eventos
import { initRouter, rerenderizarRotaAtual } from './router.js';
import { validarCampo, validarFormulario, mostrarResumo } from './validation.js';
import { adicionarCadastro } from './storage.js';

// Contêiner fixo da SPA: só o CONTEÚDO dele é recriado a cada rota,
// então listeners registrados nele continuam valendo em todas as telas.
const app = document.getElementById('app');

// ---------- Modal ----------
// Guarda o botão que abriu o modal para devolver o foco a ele ao fechar
let gatilhoModal = null;

function abrirModal(id, gatilho) {
    const modal = document.getElementById(id);
    if (!modal) return;

    gatilhoModal = gatilho;
    modal.classList.add('aberto');
    modal.querySelector('[data-fechar-modal]')?.focus(); // foco entra no modal
}

function fecharModais() {
    document
        .querySelectorAll('.modal-overlay.aberto')
        .forEach((modal) => modal.classList.remove('aberto'));

    gatilhoModal?.focus(); // foco volta ao botão que abriu o modal
    gatilhoModal = null;
}

// ---------- Menu hambúrguer (botão com aria-expanded) ----------
const botaoMenu = document.getElementById('menu-toggle');
const menuPrincipal = document.getElementById('menu-principal');

botaoMenu.addEventListener('click', () => {
    const aberto = menuPrincipal.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
});

// ---------- Link "Pular para o conteúdo" ----------
// Feito por JS porque href="#app" seria lido pelo roteador como uma rota
document.getElementById('skip-link').addEventListener('click', (evento) => {
    evento.preventDefault();
    app.focus();
});

// ---------- Formulário de cadastro ----------
function tratarEnvio(form) {
    const { valido, quantidade } = validarFormulario(form);

    if (!valido) {
        mostrarResumo(form, 'error', `Corrija ${quantidade} campo(s) destacado(s) antes de enviar.`);
        return;
    }

    const dados = Object.fromEntries(new FormData(form));
    adicionarCadastro(dados);       // grava no localStorage (set + JSON.stringify)
    rerenderizarRotaAtual();        // recria a tela, já lendo a lista atualizada (get + JSON.parse)

    // Depois de recriar a tela, o formulário é outro elemento do DOM;
    // buscamos ele de novo para limpar e mostrar a mensagem de sucesso.
    const formAtualizado = document.getElementById('form-cadastro');
    if (formAtualizado) {
        formAtualizado.reset();
        mostrarResumo(formAtualizado, 'success', 'Cadastro salvo com sucesso!');
    }
}

// ---------- Delegação de eventos no #app ----------
// click: abre e fecha o modal de detalhes da campanha
app.addEventListener('click', (evento) => {
    const gatilhoAbrir = evento.target.closest('[data-abrir-modal]');
    if (gatilhoAbrir) {
        evento.preventDefault(); // o link não deve mexer no hash (rota)
        abrirModal(gatilhoAbrir.dataset.abrirModal, gatilhoAbrir);
        return;
    }

    if (evento.target.closest('[data-fechar-modal]')) {
        evento.preventDefault();
        fecharModais();
    } else if (evento.target.classList.contains('modal-overlay')) {
        fecharModais(); // clique no fundo escuro também fecha
    }
});

// submit: a SPA assume o envio do formulário, sem recarregar a página
app.addEventListener('submit', (evento) => {
    if (evento.target.matches('#form-cadastro')) {
        evento.preventDefault();
        tratarEnvio(evento.target);
    }
});

// input: reage enquanto o usuário digita
app.addEventListener('input', (evento) => {
    const campo = evento.target;

    if (campo.id === 'estado') {
        campo.value = campo.value.toUpperCase(); // UF sempre em maiúsculas
    }

    // Validação em tempo real, só depois que o usuário já passou pelo campo
    if (campo.closest('#form-cadastro') && campo.dataset.tocado) {
        validarCampo(campo);
    }
});

// focusout: ao sair do campo, marca como "tocado" e valida (pega campos vazios)
app.addEventListener('focusout', (evento) => {
    const campo = evento.target;

    if (campo.closest('#form-cadastro') && campo.matches('input, select')) {
        campo.dataset.tocado = 'true';
        validarCampo(campo);
    }
});

// keydown: Escape fecha o modal; Tab fica preso dentro do modal aberto
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharModais();

    const aberto = document.querySelector('.modal-overlay.aberto');
    if (evento.key === 'Tab' && aberto) {
        evento.preventDefault(); // o modal só tem um elemento focável (fechar)
        aberto.querySelector('[data-fechar-modal]').focus();
    }
});

initRouter();