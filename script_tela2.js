// ===================================================
// ARQUIVO: script_tela2.js (VERSÃO FINAL E AJUSTADA)
// * CORREÇÃO: Variável 'custoChurrasqueiro' declarada no bloco D para evitar erro.
// * AJUSTE: Mão de Obra salva detalhadamente.
// ===================================================

// ===================================================
// 1. CONSTANTES DE CÁLCULO E ELEMENTOS
// ===================================================

const PROPORCOES_CHURRASCO = {
    carne: 0.40,
    linguica: 0.30,
    frango: 0.15,
    pao: 0.075,
    queijo: 0.075
};
const PESO_MEDIO_POR_PESSOA_KG = 0.3; // 300g por pessoa

const inputPessoas = document.getElementById("pessoas");
const valorCarne = document.getElementById("valorCarne");
const areaComp = document.getElementById("complementosBox");
const buffetSim = document.getElementById("buffetSim");
const buffetNao = document.getElementById("buffetNao");
// btnFinalizar não precisa ser constante se usarmos o evento submit no form
const formChurrasco = document.getElementById("formChurrasco");


// ===================================================
// 2. LÓGICA DE SELEÇÃO VISUAL (GRID)
// ===================================================

function setupItemSelection(selector) {
    const items = document.querySelectorAll(selector);

    items.forEach(item => {
        const input = item.querySelector('input');

        if (!input) return;

        item.addEventListener("click", () => {
            
            if (input.type === 'radio') {
                // Para radios, desmarca todos os outros e marca o clicado
                document.querySelectorAll(selector).forEach(c => {
                    const cInput = c.querySelector('input');
                    if (cInput && cInput.type === 'radio') cInput.checked = false;
                    c.classList.remove("selected");
                });
                
                input.checked = true;
                item.classList.add("selected");
                
            } else if (input.type === 'checkbox') {
                // Para checkboxes, apenas alterna a seleção
                input.checked = !input.checked; // Inverte o estado
                item.classList.toggle("selected", input.checked); // Garante que a classe reflita o estado do input
            }
            
            // Recalcula o KG total
            calcularNecessidadeKG();
        });
    });
}


// ===================================================
// 3. CÁLCULO AUTOMÁTICO DO KG TOTAL
// ===================================================

function calcularNecessidadeKG() {
    let pessoas = Number(inputPessoas.value);
    
    // Verifica se há pelo menos um produto de carne/linguiça/frango selecionado para o cálculo do KG total
    const produtosAtivos = Array.from(document.querySelectorAll('input[name="produtos"]:checked'))
                               .filter(input => ['carne', 'linguica', 'frango'].includes(input.value));

    let totalKg = (!pessoas || pessoas <= 0 || produtosAtivos.length === 0) 
        ? 0 
        : (pessoas * PESO_MEDIO_POR_PESSOA_KG);
        
    valorCarne.textContent = `${totalKg.toFixed(2)} Kg`;
}


// ===================================================
// 4. MOSTRAR/ESCONDER COMPLEMENTOS (BUFFET)
// ===================================================

function setupBuffetToggle() {
    
    function toggleComplementos() {
        const isBuffetSim = buffetSim.checked;
        areaComp.classList.toggle('hidden', !isBuffetSim);
        
        if (!isBuffetSim) {
            // Se o buffet for desativado, desmarca todos os complementos
            document.querySelectorAll('.complemento-item').forEach(item => {
                item.classList.remove('selected');
                item.querySelector('input').checked = false;
            });
        }
    }

    if (buffetSim && buffetNao && areaComp) {
        buffetSim.addEventListener('change', toggleComplementos);
        buffetNao.addEventListener('change', toggleComplementos);
        toggleComplementos(); // Chama ao carregar para definir o estado inicial
    }
}


// ===================================================
// 5. FINALIZAÇÃO: CALCULA, SALVA NO LOCAL STORAGE E REDIRECIONA
// ===================================================

function finalizarChurrasco() {
    console.log("-----------------------------------------");
    console.log("Iniciando Finalização do Pedido (Tela 2)");
    
    // CHECAGEM 1: Carregamento de precos.js
    if (typeof PRECOS_MEDIOS === 'undefined' || typeof TAXAS_CHURRASQUEIRO === 'undefined' || typeof MULTIPLICADORES_CORTE === 'undefined') {
        alert("ERRO CRÍTICO: Arquivo de preços (precos.js) não foi carregado corretamente. Verifique a ordem dos scripts no HTML.");
        console.error("ERRO: Variáveis de PREÇO ausentes.");
        return; 
    }
    
    const pessoas = Number(inputPessoas.value);
    
    // CHECAGEM 2: Input de Pessoas
    if (pessoas <= 0 || !inputPessoas.value) {
        // Isso já é tratado pelo checkValidity no submit, mas mantemos como backup
        console.warn("AVISO: Campo 'Pessoas' inválido. Retornando.");
        return; 
    }
    console.log(`Pessoas detectadas: ${pessoas}`);

    // --- A. PREPARAÇÃO E DEFINIÇÃO DE CORTE ---
    const corteSelecionadoElement = document.querySelector('input[name="corte"]:checked');
    const corteTipo = corteSelecionadoElement ? corteSelecionadoElement.value : 'inteira';
    const isEspetinho = (corteTipo === 'espetinho');
    
    console.log(`Tipo de Corte Selecionado: ${corteTipo}`);

    const totalPesoRequeridoKg = pessoas * PESO_MEDIO_POR_PESSOA_KG; 
    let valorTotalGeral = 0;
    const itensComprados = [];

    const observacoes = document.getElementById("observacoes") ? document.getElementById("observacoes").value : ""; 
    const produtosSelecionados = Array.from(document.querySelectorAll('input[name="produtos"]:checked')).map(input => input.value);
    const complementosSelecionados = Array.from(document.querySelectorAll('input[name="complementos"]:checked')).map(input => input.value);

    
    // 1. Calcular a proporção total dos itens SELECIONADOS 
    let somaProporcoesSelecionadas = 0;
    for (const item of produtosSelecionados) {
        if (PROPORCOES_CHURRASCO.hasOwnProperty(item)) {
            somaProporcoesSelecionadas += PROPORCOES_CHURRASCO[item];
        }
    }
    
    // --- B. CÁLCULO DE PROTEÍNAS/ACOMPANHAMENTOS PRINCIPAIS ---
    for (const item of produtosSelecionados) {
        if (PROPORCOES_CHURRASCO.hasOwnProperty(item) && PRECOS_MEDIOS.hasOwnProperty(item)) {
            
            const proporcaoBase = PROPORCOES_CHURRASCO[item];
            const proporcaoAjustada = somaProporcoesSelecionadas > 0 ? (proporcaoBase / somaProporcoesSelecionadas) : 0;
            
            const pesoItemKg = totalPesoRequeridoKg * proporcaoAjustada; 
            const custoItem = pesoItemKg * PRECOS_MEDIOS[item];
            
            valorTotalGeral += custoItem;

            let quantidadeRelatorio;
            let unidadeRelatorio;

            if (isEspetinho && (item === 'carne' || item === 'linguica' || item === 'frango')) {
                 // Para proteínas que podem ser espetinhos: 3 espetos por pessoa
                const espetosPorPessoaParaItem = proporcaoAjustada * 3; 
                quantidadeRelatorio = espetosPorPessoaParaItem * pessoas; 
                unidadeRelatorio = 'Espetos';
            } else {
                // Para todos os outros itens: usa KG
                quantidadeRelatorio = pesoItemKg;
                unidadeRelatorio = 'Kg';
            }
            
            itensComprados.push({
                nome: item.charAt(0).toUpperCase() + item.slice(1), 
                quantidade: quantidadeRelatorio.toFixed(2), 
                unidade: unidadeRelatorio,
                custo: custoItem, 
            });
        }
    }


    // --- C. CÁLCULO DE COMPLEMENTOS (Buffet) ---
    // Sempre por KG
    complementosSelecionados.forEach(item => {
        if (PRECOS_MEDIOS.hasOwnProperty(item)) {
            const pesoComplemento = pessoas * 0.1; // 100g por pessoa (Estimativa)
            const custoComplemento = pesoComplemento * PRECOS_MEDIOS[item];

            valorTotalGeral += custoComplemento;

            itensComprados.push({
                nome: item.charAt(0).toUpperCase() + item.slice(1), 
                quantidade: pesoComplemento.toFixed(2),
                unidade: 'Kg',
                custo: custoComplemento,
            });
        }
    });

    // ===================================================
    // D. CÁLCULO DE MÃO DE OBRA (CORRIGIDO)
    // ===================================================
    const valorBaseHora = TAXAS_CHURRASQUEIRO.VALOR_HORA_BASE;
    const horasEvento = TAXAS_CHURRASQUEIRO.HORAS_PADRAO_EVENTO;
    const custoAjudante = TAXAS_CHURRASQUEIRO.CUSTO_AJUDANTE_BUFFET;
    
    // 1. Custo BASE do Churrasqueiro
    let custoChurrasqueiro = valorBaseHora * horasEvento; // Variável declarada aqui!
    
    let multiplicadorCorte = 1.0;
    if (corteTipo && MULTIPLICADORES_CORTE.hasOwnProperty(corteTipo)) {
        multiplicadorCorte = MULTIPLICADORES_CORTE[corteTipo];
    }
    // Aplica o multiplicador ao custo do churrasqueiro
    custoChurrasqueiro *= multiplicadorCorte; 

    let custoTotalAjudante = 0;
    const buffetAtivo = complementosSelecionados.length > 0;
    
    if (buffetAtivo) {
        custoTotalAjudante = custoAjudante;
    }
    
    // Custo TOTAL da Mão de Obra
    let custoMaoDeObraTotal = custoChurrasqueiro + custoTotalAjudante;

    valorTotalGeral += custoMaoDeObraTotal;
    console.log(`Custo Churrasqueiro (com multi): R$${custoChurrasqueiro.toFixed(2)}`);
    console.log(`Valor Total Mão de Obra: R$${custoMaoDeObraTotal.toFixed(2)}`);
    console.log(`Valor Total Geral (Bruto): R$${valorTotalGeral}`);


    // ===================================================
    // E. SALVA NO LOCAL STORAGE (AJUSTADO)
    // ===================================================
    const dadosCliente = JSON.parse(localStorage.getItem('dadosCliente')) || {};
    
    const resumoFinal = {
        // INFORMAÇÕES DO CLIENTE (Tela 1)
        nomeCliente: dadosCliente.nome || "Cliente Não Informado",
        telefoneCliente: dadosCliente.telefone || "Não Informado", 
        enderecoEvento: dadosCliente.endereco || "Não Informado",
        dataEvento: dadosCliente.data || "Não Informada",
        horarioEvento: dadosCliente.horario || "Não Informado",
        // FIM DOS CAMPOS NOVOS

        pessoas: pessoas,
        totalPesoRequeridoKg: totalPesoRequeridoKg.toFixed(2), 
        itens: itensComprados.map(item => ({...item, quantidade: item.quantidade, unidade: item.unidade, custo: item.custo.toFixed(2)})),
        corte: corteTipo.toUpperCase(),
        observacoes: observacoes || "Nenhuma.",
        
        // MÃO DE OBRA: USANDO AS NOVAS VARIÁVEIS CORRETAS
        valorHoraBase: valorBaseHora.toFixed(2), 
        multiplicadorCorte: multiplicadorCorte.toFixed(2), 
        custoChurrasqueiro: custoChurrasqueiro.toFixed(2), // Agora definido e salvo!
        custoTotalAjudante: custoTotalAjudante.toFixed(2),
        custoMaoDeObraFinal: custoMaoDeObraTotal.toFixed(2), // Total da Mão de Obra
        horasEvento: horasEvento,

        valorTotal: valorTotalGeral.toFixed(2)
    };

    localStorage.setItem('resumoChurrasco', JSON.stringify(resumoFinal));
    console.log("Dados de resumo salvos:", resumoFinal); 

    // --- F. REDIRECIONA PARA A PRÓXIMA PÁGINA (Tela 3) ---
    window.location.href = "orcamentoFinal.html"; 
}


// ===================================================
// 6. INICIALIZAÇÃO DA PÁGINA (CORREÇÃO DE SELEÇÃO INICIAL)
// ===================================================

function applyInitialSelection() {
    // Procura todos os inputs de checkbox/radio que estão 'checked'
    const checkedInputs = document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
    
    checkedInputs.forEach(input => {
        // Encontra o elemento pai que contém a classe 'item-select' e adiciona a classe 'selected'
        const parentItem = input.closest('.item-select');
        if (parentItem) {
            parentItem.classList.add('selected');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Configura a lógica de clique para todos os itens
    setupItemSelection(".produto-item");
    setupItemSelection(".corte-item");
    setupItemSelection(".complemento-item");

    // 2. Aplica a seleção visual inicial (para inputs que já vieram checked do HTML)
    applyInitialSelection();

    // 3. Conecta eventos
    if (inputPessoas) {
        inputPessoas.addEventListener('input', calcularNecessidadeKG);
        calcularNecessidadeKG(); 
    }

    // CORREÇÃO: Conecta o evento SUBMIT do formulário
    if (formChurrasco) {
        formChurrasco.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão da página
            finalizarChurrasco();
        });
    }
    
    setupBuffetToggle();
});