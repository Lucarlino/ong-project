// storage.js - persistência dos cadastros no localStorage do navegador.
// localStorage só guarda strings, então todo objeto/array precisa ser
// convertido com JSON.stringify() antes de gravar (set) e reconvertido
// com JSON.parse() ao recuperar (get).

const CHAVE = 'ong-mao-solidaria:cadastros';

// ---------- Leitura (get + parse) ----------
export function obterCadastros() {
    const bruto = localStorage.getItem(CHAVE); // string ou null, se nunca foi gravado

    if (!bruto) return []; // primeira visita: nenhum dado salvo ainda

    try {
        const dados = JSON.parse(bruto); // string -> array de objetos JavaScript
        return Array.isArray(dados) ? dados : [];
    } catch {
        // Dado corrompido/manual no DevTools: melhor ignorar do que quebrar a página
        console.warn('Não foi possível ler os cadastros salvos; ignorando dado corrompido.');
        return [];
    }
}

// ---------- Gravação (stringify + set) ----------
function salvarCadastros(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista)); // array -> string
}

// Adiciona um novo cadastro à lista existente e grava tudo de novo
export function adicionarCadastro(dados) {
    const cadastros = obterCadastros();

    cadastros.push({
        ...dados,
        id: Date.now(),                    // identificador simples, único por horário
        dataCadastro: new Date().toISOString()
    });

    salvarCadastros(cadastros);
    return cadastros;
}

export function removerCadastro(id) {
    const cadastros = obterCadastros().filter((cadastro) => cadastro.id !== id);
    salvarCadastros(cadastros);
    return cadastros;
}