// templates.js - sistema de templates: funções que transformam DADOS em HTML.
// Ideia central: os dados ficam em arrays/objetos, e cada componente visual é
// escrito UMA vez (função com Template Literals). A lista é gerada com map().
import { obterCadastros } from './storage.js';

// date-fns via CDN (ESM), carregada só aqui: cálculo de datas relativas
// ("há 2 minutos") é chato de fazer à mão (meses de 30/31 dias, anos
// bissextos, plural correto), então delego isso a uma biblioteca testada
// em vez de reescrever essa lógica manualmente.
import { formatDistanceToNow } from 'https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm';
import { ptBR } from 'https://cdn.jsdelivr.net/npm/date-fns@3.6.0/locale/+esm';

// ---------- Utilitário: evita que texto vire HTML (XSS) ----------
const escapeHTML = (texto) =>
    String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

// ---------- Dados de origem ----------
const ONG = {
    sobre: 'A ONG Mãos Solidárias é uma organização do terceiro setor fundada em 2015, dedicada a combater a insegurança alimentar e promover a inclusão social de famílias em situação de vulnerabilidade. Atuamos por meio de campanhas de doação, capacitação profissional e apoio educacional, contando com o trabalho voluntário de centenas de pessoas em todo o país.',
    email: 'contato@maossolidarias.org',
    telefone: '(11) 3333-4444',
    telefoneLink: '+551133334444',
    endereco: 'Rua da Esperança, 123 - São Paulo/SP'
};

const CATEGORIAS = {
    voluntariado: 'Voluntariado',
    doacao: 'Doação'
};

const projetos = [
    {
        categoria: 'voluntariado',
        titulo: 'Atuação em Campo',
        descricao: 'Voluntários que desejam atuar diretamente com as comunidades atendidas participam da distribuição de doações, oficinas educativas e eventos de mobilização social nos bairros parceiros.'
    },
    {
        categoria: 'voluntariado',
        titulo: 'Apoio Administrativo',
        descricao: 'Para quem prefere contribuir remotamente, oferecemos frentes de apoio em organização de campanhas, comunicação nas redes sociais e gestão de cadastro de doadores.'
    },
    {
        categoria: 'doacao',
        titulo: 'Doação de Alimentos',
        descricao: 'Nossa campanha permanente de arrecadação de alimentos não perecíveis conta com pontos de coleta em diversos bairros da cidade. Consulte o ponto mais próximo de você na seção de cadastro.',
        detalhes: {
            id: 'modal-alimentos',
            texto: 'Os pontos de coleta funcionam de segunda a sábado, das 9h às 18h. Aceitamos alimentos não perecíveis dentro do prazo de validade, embalados e identificados. Toda a arrecadação é redistribuída em até 72 horas para as famílias cadastradas no programa.'
        }
    },
    {
        categoria: 'doacao',
        titulo: 'Doação Financeira',
        descricao: 'Contribuições financeiras, recorrentes ou pontuais, sustentam nossos programas de capacitação profissional e apoio educacional às famílias atendidas.'
    }
];

// O formulário também é descrito como dado: grupos (fieldset) com seus campos
const gruposCadastro = [
    {
        atributo: 'id="user-details"',
        legenda: 'Dados do Usuário',
        campos: [
            { id: 'nome', rotulo: 'Nome completo:', tipo: 'text', placeholder: 'Digite seu nome completo' },
            { id: 'nascimento', rotulo: 'Data de nascimento:', tipo: 'date' },
            {
                id: 'cpf', rotulo: 'CPF:', tipo: 'text',
                pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}',
                placeholder: '000.000.000-00',
                title: 'Formato esperado: 000.000.000-00'
            }
        ]
    },
    {
        atributo: 'id="contact-info"',
        legenda: 'Informações de Contato',
        campos: [
            { id: 'email', rotulo: 'E-mail:', tipo: 'email', placeholder: 'seuemail@exemplo.com' },
            {
                id: 'telefone', rotulo: 'Telefone:', tipo: 'tel',
                pattern: '\\(\\d{2}\\) \\d{4,5}-\\d{4}',
                placeholder: '(00) 00000-0000',
                title: 'Formato esperado: (00) 00000-0000'
            },
            {
                id: 'cep', rotulo: 'CEP:', tipo: 'text',
                pattern: '\\d{5}-\\d{3}',
                placeholder: '00000-000',
                title: 'Formato esperado: 00000-000'
            },
            { id: 'endereco', rotulo: 'Endereço:', tipo: 'text', placeholder: 'Rua, número, bairro' },
            { id: 'cidade', rotulo: 'Cidade:', tipo: 'text', placeholder: 'Sua cidade' },
            { id: 'estado', rotulo: 'Estado:', tipo: 'text', placeholder: 'UF', maxlength: 2 }
        ]
    },
    {
        atributo: 'class="preferences"',
        legenda: 'Preferências',
        campos: [
            {
                id: 'area', rotulo: 'Área de interesse:', tipo: 'select',
                opcoes: [
                    { valor: 'voluntariado', texto: 'Voluntariado' },
                    { valor: 'doacao', texto: 'Doação' }
                ]
            }
        ]
    }
];

// ---------- Componentes (escritos uma vez, reaproveitados com map) ----------
const cardProjeto = ({ categoria, titulo, descricao, detalhes }) => `
    <article class="project col-6">
        <div>
            <span class="badge badge-${categoria}">${CATEGORIAS[categoria]}</span>
            <h3>${escapeHTML(titulo)}</h3>
            <p>${escapeHTML(descricao)}</p>
        </div>
        ${detalhes
            ? `<a href="#/projetos" class="btn-link" data-abrir-modal="${detalhes.id}">Ver detalhes da campanha</a>`
            : ''}
    </article>
`;

const modalDetalhes = ({ titulo, detalhes }) => `
    <div id="${detalhes.id}" class="modal-overlay">
        <div class="modal">
            <a href="#/projetos" class="modal-close" data-fechar-modal aria-label="Fechar detalhes da campanha">&times;</a>
            <h3>${escapeHTML(titulo)}</h3>
            <p>${escapeHTML(detalhes.texto)}</p>
        </div>
    </div>
`;

const secaoProjetos = (id, titulo, categoria) => {
    const itens = projetos.filter((projeto) => projeto.categoria === categoria);

    return `
        <section id="${id}">
            <h2>${titulo}</h2>
            <div class="grid">
                ${itens.map(cardProjeto).join('')}
            </div>
            ${itens.filter((projeto) => projeto.detalhes).map(modalDetalhes).join('')}
        </section>
    `;
};

const campoFormulario = (campo) => {
    const controle = campo.tipo === 'select'
        ? `<select id="${campo.id}" name="${campo.id}" required>
               ${campo.opcoes.map((o) => `<option value="${o.valor}">${o.texto}</option>`).join('')}
           </select>`
        : `<input type="${campo.tipo}" id="${campo.id}" name="${campo.id}"
               ${campo.placeholder ? `placeholder="${escapeHTML(campo.placeholder)}"` : ''}
               ${campo.pattern ? `pattern="${escapeHTML(campo.pattern)}"` : ''}
               ${campo.title ? `title="${escapeHTML(campo.title)}"` : ''}
               ${campo.maxlength ? `maxlength="${campo.maxlength}"` : ''}
               required>`;

    return `
        <div class="form-group">
            <label for="${campo.id}">${campo.rotulo}</label>
            ${controle}
        </div>
    `;
};

const grupoFormulario = (grupo) => `
    <fieldset ${grupo.atributo}>
        <legend>${grupo.legenda}</legend>
        ${grupo.campos.map(campoFormulario).join('')}
    </fieldset>
`;

// Item da lista de cadastros já salvos no localStorage (histórico do navegador)
const itemCadastroSalvo = ({ nome, area, dataCadastro }) => {
    const tempoRelativo = formatDistanceToNow(new Date(dataCadastro), {
        addSuffix: true,
        locale: ptBR
    });

    return `
        <li>
            ${escapeHTML(nome)} — <span class="badge badge-${area}">${CATEGORIAS[area]}</span>
            <small class="cadastro-tempo">cadastrado ${tempoRelativo}</small>
        </li>
    `;
};

const listaCadastrosSalvos = () => {
    const cadastros = obterCadastros(); // lê o histórico restaurado do localStorage

    return `
        <section id="lista-cadastros">
            <h3>Cadastros Realizados (${cadastros.length})</h3>
            ${cadastros.length
                ? `<ul class="lista-cadastros">${cadastros.map(itemCadastroSalvo).join('')}</ul>`
                : '<p>Nenhum cadastro salvo neste navegador ainda.</p>'}
        </section>
    `;
};

// ---------- Templates de cada tela (usados pelo router.js) ----------
export const templates = {
    home: () => `
        <section id="apresentacao">
            <h2>Quem Somos</h2>
            <div class="grid">
                <div class="col-6">
                    <img src="../imagens/equipe.jpg" alt="Voluntários da ONG Mãos Solidárias distribuindo cestas de doações para famílias em situação de vulnerabilidade">
                </div>
                <div class="col-6">
                    <p>${ONG.sobre}</p>
                </div>
            </div>
        </section>

        <section id="contato">
            <h2>Fale Conosco</h2>
            <address>
                <p>E-mail: <a href="mailto:${ONG.email}">${ONG.email}</a></p>
                <p>Telefone: <a href="tel:${ONG.telefoneLink}">${ONG.telefone}</a></p>
                <p>Endereço: ${ONG.endereco}</p>
            </address>
        </section>
    `,

    projetos: () => `
        ${secaoProjetos('voluntariado', 'Como Ser Voluntário', 'voluntariado')}
        ${secaoProjetos('doacoes', 'Campanhas de Doação', 'doacao')}
    `,

    cadastro: () => `
        <h2>Cadastre-se</h2>

        <div class="alert alert-info">
            <strong>Atenção:</strong> todos os campos marcados como obrigatórios devem ser
            preenchidos corretamente antes do envio do formulário.
        </div>

        <form id="form-cadastro" novalidate>
            ${gruposCadastro.map(grupoFormulario).join('')}

            <div class="form-actions">
                <button type="submit">Cadastrar</button>
            </div>
        </form>

        ${listaCadastrosSalvos()}
    `,

    notFound: () => `
        <section id="nao-encontrado">
            <h2>Página não encontrada</h2>
            <p><a href="#/">Voltar para o início</a></p>
        </section>
    `
};