// router.js - roteamento da SPA por hash (location.hash)
import { templates } from './templates.js';

// Mapa de rotas: caminho -> função de template que devolve o HTML da tela
const routes = {
    '/': templates.home,
    '/projetos': templates.projetos,
    '/cadastro': templates.cadastro
};

// Títulos da aba por rota (leitores de tela anunciam a mudança de "página")
const titulos = {
    '/': 'Início',
    '/projetos': 'Projetos',
    '/cadastro': 'Cadastro'
};

// Lê o caminho atual a partir do hash. "#/projetos" -> "/projetos"
function getPath() {
    return location.hash.slice(1) || '/';
}

// Limpa o contêiner principal e injeta o fragmento da rota atual.
// moverFoco = true só quando o usuário navegou (evita roubar o foco na 1ª carga).
function render(moverFoco = false) {
    const app = document.getElementById('app');
    const caminho = getPath();
    const template = routes[caminho] ?? templates.notFound;

    app.replaceChildren();                          // limpa o contêiner alvo
    app.insertAdjacentHTML('beforeend', template()); // injeta o novo fragmento

    window.scrollTo(0, 0);                           // volta ao topo a cada "página"

    // Acessibilidade: atualiza o título da aba e leva o foco ao conteúdo novo
    document.title = `${titulos[caminho] ?? 'Página não encontrada'} - Mãos Solidárias`;
    if (moverFoco) app.focus();

    // Fecha o menu hambúrguer depois de navegar no mobile
    document.getElementById('menu-principal')?.classList.remove('aberto');
    document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');
}

// Intercepta as navegações: o hashchange dispara a cada clique em um link "#/..."
export function initRouter() {
    window.addEventListener('hashchange', () => render(true));
    render(); // renderiza a rota atual na primeira carga da página
}

// Permite re-renderizar a rota atual sem navegar (ex.: depois de salvar um
// cadastro, para a lista de "Cadastros Realizados" aparecer atualizada)
export function rerenderizarRotaAtual() {
    render();
}