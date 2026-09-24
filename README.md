# ONG Project

Plataforma web desenvolvida para organizações não-governamentais (ONGs) do terceiro setor, com o objetivo de facilitar a divulgação de projetos sociais, a captação de recursos e o engajamento de doadores e voluntários.

## 📖 Sobre o projeto

O terceiro setor brasileiro movimenta mais de R$ 15 bilhões anuais e emprega cerca de 3 milhões de pessoas, mas apenas 30% das mais de 820 mil organizações da sociedade civil do país possuem presença digital adequada (IBGE). Este projeto nasceu como resposta a essa lacuna, entregando uma plataforma web completa, acessível e responsiva para uso por ONGs.

## 🚀 Tecnologias utilizadas

- **HTML5** semântico
- **CSS3** (variáveis customizadas, Grid de 12 colunas, Flexbox, media queries)
- **JavaScript** (Vanilla JS, arquitetura SPA por hash routing)
- **date-fns** (via CDN) para formatação de datas relativas
- **Git & GitHub** (versionamento com estratégia GitFlow)

## ✨ Funcionalidades

- Navegação em SPA (Single Page Application), sem recarregamento de página
- Sistema de templates dinâmicos em JavaScript
- Formulário de cadastro com validação em tempo real e feedback visual
- Persistência de dados no navegador via `localStorage`
- Design system consistente (paleta de cores, tipografia e espaçamentos modulares)
- Menu de navegação responsivo (dropdown/hambúrguer)
- Componentes de feedback visual (alertas, toasts, modais, badges)

## 📁 Estrutura de pastas

```
ong-project/
├── README.md
└── ong-project/
    ├── css/        → style.css
    ├── html/       → index.html, projetos.html, cadastro.html
    ├── imagens/    → equipe.jpg
    └── js/         → main.js, router.js, storage.js, templates.js, validation.js
```

## ▶️ Como executar

1. Instale o Git e o VS Code com a extensão Live Server.
2. Clone o repositório: `git clone https://github.com/Lucarlino/ong-project.git`
3. Abra a pasta no VS Code.
4. Clique com o botão direito em `ong-project/html/index.html` e escolha "Open with Live Server".

Não há dependências para instalar: a date-fns é carregada por CDN.

## 🌿 Estratégia GitFlow

- `main`: versões estáveis, marcadas com tags (ex.: `v1.0.0`)
- `develop`: integração do desenvolvimento
- `feature/`: novas funcionalidades, criadas a partir da `develop`
- Commits semânticos (`feat:`, `docs:`) e integração por Pull Request

## 👤 Autor

Lucas Souza Santos