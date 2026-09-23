// validation.js - verificação de consistência do formulário e feedback visual

const UFS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// CPF: além do formato, confere os dois dígitos verificadores
export function cpfValido(cpf) {
    const digitos = cpf.replace(/\D/g, '');
    if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false; // 111.111.111-11 etc.

    const calcularDigito = (base) => {
        const soma = [...base].reduce(
            (total, digito, i) => total + Number(digito) * (base.length + 1 - i), 0
        );
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    return calcularDigito(digitos.slice(0, 9)) === Number(digitos[9])
        && calcularDigito(digitos.slice(0, 10)) === Number(digitos[10]);
}

// ---------- Regras por campo: recebem o valor e devolvem a mensagem de erro ('' = ok) ----------
export const regras = {
    nome: (v) => {
        if (!v) return 'Informe o nome completo.';
        if (!/^[\p{L}\s'.-]+$/u.test(v)) return 'Use apenas letras no nome.';
        if (v.split(/\s+/).length < 2) return 'Digite nome e sobrenome.';
        return '';
    },

    nascimento: (v) => {
        if (!v) return 'Informe a data de nascimento.';
        const data = new Date(`${v}T00:00:00`);
        if (Number.isNaN(data.getTime()) || data.getFullYear() < 1900) return 'Informe uma data válida.';
        if (data > new Date()) return 'A data de nascimento não pode estar no futuro.';
        return '';
    },

    cpf: (v) => {
        if (!v) return 'Informe o CPF.';
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v)) return 'Use o formato 000.000.000-00.';
        if (!cpfValido(v)) return 'CPF inválido: confira os dígitos.';
        return '';
    },

    email: (v) => {
        if (!v) return 'Informe o e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Digite um e-mail válido, como nome@exemplo.com.';
        return '';
    },

    telefone: (v) => {
        if (!v) return 'Informe o telefone.';
        if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(v)) return 'Use o formato (00) 00000-0000.';
        return '';
    },

    cep: (v) => {
        if (!v) return 'Informe o CEP.';
        if (!/^\d{5}-\d{3}$/.test(v)) return 'Use o formato 00000-000.';
        return '';
    },

    endereco: (v) => {
        if (!v) return 'Informe o endereço.';
        if (v.length < 5) return 'O endereço está muito curto.';
        return '';
    },

    cidade: (v) => {
        if (!v) return 'Informe a cidade.';
        if (!/^[\p{L}\s'-]{2,}$/u.test(v)) return 'Digite um nome de cidade válido.';
        return '';
    },

    estado: (v) => {
        if (!v) return 'Informe a UF.';
        if (!UFS.includes(v.toUpperCase())) return 'Informe uma UF válida, como SP.';
        return '';
    },

    area: (v) => {
        if (!v) return 'Selecione uma área de interesse.';
        return '';
    }
};

// ---------- Feedback no DOM ----------
// Injeta (ou remove) a mensagem de erro logo abaixo do grupo do campo
function mostrarMensagem(campo, mensagem) {
    const id = `erro-${campo.id}`;
    let aviso = document.getElementById(id);

    if (!mensagem) {
        aviso?.remove();
        campo.removeAttribute('aria-invalid');
        campo.removeAttribute('aria-describedby');
        return;
    }

    if (!aviso) {
        aviso = document.createElement('small');
        aviso.id = id;
        aviso.className = 'mensagem-erro';
        aviso.setAttribute('role', 'alert');
        campo.closest('.form-group').after(aviso);
    }

    aviso.textContent = mensagem; // textContent: o texto nunca é interpretado como HTML
    campo.setAttribute('aria-invalid', 'true');
    campo.setAttribute('aria-describedby', id);
}

// Valida UM campo. setCustomValidity integra a regra ao :invalid / :valid do CSS,
// então as bordas vermelha/verde e os ícones já existentes reagem automaticamente.
export function validarCampo(campo) {
    const regra = regras[campo.id];
    if (!regra) return true;

    const mensagem = regra(campo.value.trim());
    campo.setCustomValidity(mensagem);
    mostrarMensagem(campo, mensagem);
    return mensagem === '';
}

// Valida o formulário inteiro (ato da submissão) e foca o primeiro campo com erro
export function validarFormulario(form) {
    const campos = [...form.querySelectorAll('input, select')];
    campos.forEach((campo) => { campo.dataset.tocado = 'true'; });

    const invalidos = campos.filter((campo) => !validarCampo(campo));
    invalidos[0]?.focus();

    return { valido: invalidos.length === 0, quantidade: invalidos.length };
}

// Resumo no topo do formulário, reaproveitando os alertas do design system
export function mostrarResumo(form, tipo, texto) {
    let resumo = document.getElementById('resumo-formulario');

    if (!resumo) {
        resumo = document.createElement('div');
        resumo.id = 'resumo-formulario';
        resumo.setAttribute('role', 'status');
        form.prepend(resumo);
    }

    resumo.className = `alert alert-${tipo}`; // alert-error ou alert-success
    resumo.textContent = texto;
}