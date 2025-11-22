// ===================================================
// ARQUIVO: script_tela1.js (AJUSTADO E COMPLETO)
// ===================================================

const telInput = document.getElementById("telefone");
const formCliente = document.getElementById("formCliente");

// ===================================================
// A. FUNÇÃO DE MÁSCARA DE TELEFONE
// ===================================================

if (telInput) {
    telInput.addEventListener("input", function () {
        let v = this.value.replace(/\D/g, "");

        if (v.length > 11) v = v.slice(0, 11);

        if (v.length > 6) {
            this.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
        } else if (v.length > 2) {
            this.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
            this.value = `(${v}`;
        }
    });
}


// ===================================================
// B. FUNÇÃO DE SALVAMENTO E REDIRECIONAMENTO (NOVO)
// ===================================================

function salvarDadosCliente(event) {
    // 1. Previne o comportamento padrão (se estivéssemos usando um botão 'submit')
    // Se o formulário não for válido, o navegador não deixa prosseguir
    if (!formCliente.checkValidity()) {
        console.warn("Formulário inválido. Campos obrigatórios não preenchidos.");
        return; // Sai da função se o formulário for inválido
    }
    
    // OBTÉM VALORES DOS CAMPOS (usando os IDs do seu HTML)
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;
    const dataEvento = document.getElementById("dataEvento").value; // ID do seu HTML
    const horaInicio = document.getElementById("horaInicio").value; // ID do seu HTML

    // CRIA O OBJETO DE DADOS (USANDO AS CHAVES QUE A TELA 2 ESPERA)
    const dadosParaSalvar = {
        nome: nome,
        telefone: telefone,
        endereco: endereco, 
        data: dataEvento,    // Salvando como 'data'
        horario: horaInicio  // Salvando como 'horario'
    };

    // SALVA NO LOCAL STORAGE
    localStorage.setItem('dadosCliente', JSON.stringify(dadosParaSalvar));
    console.log("Dados do cliente salvos no Local Storage:", dadosParaSalvar);

    // Redireciona para a próxima página
    window.location.href = "../Index/detalhesChurrasco.html";
}


// ===================================================
// C. CONFIGURAÇÃO DE EVENTOS
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    const btnContinuar = document.querySelector('.actions a.btn');
    
    if (btnContinuar) {
        // Remove a ação padrão do link
        btnContinuar.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o redirecionamento imediato
            
            // Força a validação do formulário HTML5
            if (formCliente.checkValidity()) {
                salvarDadosCliente(e);
            } else {
                // Se o formulário for inválido, o navegador mostra as mensagens de erro nativas
                // Precisamos forçar o submit para ativar as mensagens de erro nativas (se o form não for submit)
                formCliente.reportValidity(); 
            }
        });
    }
});