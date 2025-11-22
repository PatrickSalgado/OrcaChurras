// ===================================================
// ARQUIVO: script_tela3.js (FINALIZADO E AJUSTADO)
// * INCLUIU: Custo Churrasqueiro e Ajudante (SÓ O VALOR FINAL)
// * REMOVEU: Detalhes do cálculo (fórmula)
// ===================================================

const resumoData = JSON.parse(localStorage.getItem('resumoChurrasco'));

// Função para formatar os dados e enviar a mensagem pelo WhatsApp
function encaminharWhatsApp() {
    if (!resumoData) {
        alert("Erro: Dados do orçamento não encontrados para envio.");
        return;
    }
    
    // --- Valores Finais ---
    const custoFinalChurrasqueiro = Number(resumoData.custoChurrasqueiro); 
    const custoAjudante = Number(resumoData.custoTotalAjudante);
    
    // Calcula o custo da mercadoria para exibir detalhado
    const custoMercadoria = Number(resumoData.valorTotal) - Number(resumoData.custoMaoDeObraFinal);

    // 1. FORMATAR ITENS (Produtos e Complementos)
    const produtos = resumoData.itens
        .map(item => `${item.nome}: ${item.quantidade} ${item.unidade}`)
        .join('\n- ');
        
    // 2. CONSTRUIR A MENSAGEM
    const mensagem = `
*--- 📝 NOVO ORÇAMENTO ORÇACHURRAS ---*

*Cliente:* ${resumoData.nomeCliente}
*Contato:* ${resumoData.telefoneCliente}

*Detalhes do Evento:*
Pessoas: ${resumoData.pessoas}
Data/Horário: ${resumoData.dataEvento} às ${resumoData.horarioEvento}
Endereço: ${resumoData.enderecoEvento}
Tipo de Corte: ${resumoData.corte}
Observações: ${resumoData.observacoes}

*Itens Solicitados (Mercadoria):*
- ${produtos}

*Resumo Financeiro:*
Custo Mercadoria: R$ ${custoMercadoria.toFixed(2).replace('.', ',')}
Custo Churrasqueiro: R$ ${custoFinalChurrasqueiro.toFixed(2).replace('.', ',')}
Custo Ajudante: R$ ${custoAjudante.toFixed(2).replace('.', ',')}
*VALOR TOTAL ORÇAMENTO:* R$ ${resumoData.valorTotal.replace('.', ',')}
    `;
    
    // 3. CODIFICAR E ENVIAR
    const textoCodificado = encodeURIComponent(mensagem.trim());
    
    const numeroDestino = '5511971560709'; 
    
    window.open(`https://api.whatsapp.com/send?phone=${numeroDestino}&text=${textoCodificado}`, '_blank');
}


// Função de Inicialização (Carrega dados e Conecta Botões)
document.addEventListener('DOMContentLoaded', () => {
    
    if (!resumoData) {
        alert("Erro: Dados do orçamento não encontrados. Voltando para o início.");
        window.location.href = "dadosCliente.html";
        return;
    }

    // --- A. INFORMAÇÕES DO CLIENTE E EVENTO ---
    document.getElementById('resumoNomeCliente').textContent = resumoData.nomeCliente;
    document.getElementById('resumoTelefoneCliente').textContent = resumoData.telefoneCliente;
    document.getElementById('resumoEnderecoEvento').textContent = resumoData.enderecoEvento;
    document.getElementById('resumoDataEvento').textContent = resumoData.dataEvento;
    document.getElementById('resumoHorarioEvento').textContent = resumoData.horarioEvento;

    document.getElementById('resumoPessoas').textContent = resumoData.pessoas;
    document.getElementById('resumoTotalKg').textContent = `${resumoData.totalPesoRequeridoKg} Kg`;
    document.getElementById('resumoCorte').textContent = resumoData.corte;
    document.getElementById('resumoObservacoes').textContent = resumoData.observacoes || "Nenhuma.";

    // --- B. PREENCHIMENTO DA TABELA DE ITENS ---
    const tabelaCorpo = document.getElementById('tabelaResumo').querySelector('tbody');
    tabelaCorpo.innerHTML = ''; 

    resumoData.itens.forEach(item => {
        const row = tabelaCorpo.insertRow();
        
        row.insertCell().textContent = item.nome;
        row.insertCell().textContent = `${item.quantidade} ${item.unidade}`; 
        
        const custoFormatado = Number(item.custo).toFixed(2).replace('.', ',');
        row.insertCell().textContent = `R$ ${custoFormatado}`;
    });
    
    // --- C. CUSTOS DE MÃO DE OBRA E TOTAL (AJUSTADO - APENAS VALORES) ---
    
    // Horas de Serviço (Mantido)
    document.getElementById('resumoHorasEvento').textContent = `${resumoData.horasEvento}h`;
    
    // 1. Custo Churrasqueiro (Apenas o valor final)
    const custoFinal = Number(resumoData.custoChurrasqueiro);
    const custoChurrasqueiroFormatado = `R$ ${custoFinal.toFixed(2).replace('.', ',')}`;

    const elementoDetalhe = document.getElementById('resumoCustoChurrasqueiroDetalhado'); 
    if (elementoDetalhe) {
        elementoDetalhe.textContent = custoChurrasqueiroFormatado;
    } else {
        console.error("ERRO: Elemento 'resumoCustoChurrasqueiroDetalhado' não encontrado no HTML. Verifique a correção da Tela 3."); 
    }
    
    // 2. Custo Ajudante (igual ao anterior)
    document.getElementById('resumoCustoAjudante').textContent = `R$ ${Number(resumoData.custoTotalAjudante).toFixed(2).replace('.', ',')}`;
    
    // Total Final (Mantido)
    document.getElementById('resumoValorTotal').textContent = `R$ ${Number(resumoData.valorTotal).toFixed(2).replace('.', ',')}`;

    // --- D. CONEXÃO DE BOTÕES ---

    // Botão Voltar (volta para a Tela 2)
    const btnVoltar = document.getElementById('btnVoltarResumo');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.location.href = "detalhesChurrasco.html"; 
        });
    }

    // Botão WhatsApp
    const btnWhatsapp = document.getElementById('btnEnviarWhatsapp');
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', encaminharWhatsApp);
    }
});