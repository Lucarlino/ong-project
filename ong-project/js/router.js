// router.js - roteamento da SPA por hash (location.hash)
import { templates } from './templates.js';

// Mapa de rotas: caminho -> função de template que devolve o HTML da tela
const routes = {
    '/': templates.home,
    '/projetos': templates.projetos,
    '/cadastro': templates.cadastro
};

// Lê o caminho atual a partir do hash. "#/projetos" -> "/projetos"
function getPath() {
    return location.hash.slice(1) || '/';
}

// Limpa o contêiner principal e injeta o fragmento da rota atual
function render() {
    const app = document.getElementById('app');
    const template = routes[getPath()] ?? templates.notFound;

    app.replaceChildren();                          // limpa o contêiner alvo
    app.insertAdjacentHTML('beforeend', template()); // injeta o novo fragmento

    window.scrollTo(0, 0);                           // volta ao topo a cada "página"

    // Fecha o menu hambúrguer (checkbox do CSS) depois de navegar no mobile
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) navToggle.checked = false;
}

// Intercepta as navegações: o hashchange dispara a cada clique em um link "#/..."
export function initRouter() {
    window.addEventListener('hashchange', render);
    render(); // renderiza a rota atual na primeira carga da página
}

// Permite re-renderizar a rota atual sem navegar (ex.: depois de salvar um
// cadastro, para a lista de "Cadastros Realizados" aparecer atualizada)
export function rerenderizarRotaAtual() {
    render();
}