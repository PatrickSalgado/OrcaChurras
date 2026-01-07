// ===================================================
// ARQUIVO: precos.js (ATUALIZADO)
// ===================================================

const PRECOS_MEDIOS = {
    // --- Proteínas e Acompanhamentos Principais (R$ por KG) ---
    carne: 39.90,         
    linguica: 26.90,      
    frango: 21.00,
    pao: 9.90, 
    queijo: 19.90, 
    
    // --- Complementos de Buffet (R$ por KG) ---
    arroz: 5.50, 
    vinagrete: 9.50,
    farofa: 20.00,
    maionese: 13.00
};

// ===================================================
// NOVAS CONSTANTES PARA MÃO DE OBRA E TAXAS
// ===================================================

const TAXAS_CHURRASQUEIRO = {
    // Valor fixo por hora, alterável
    VALOR_HORA_BASE: 41.66666666666667, 
    // Tempo padrão de evento (em horas)
    HORAS_PADRAO_EVENTO: 6, 
    // Taxa adicional fixa se o buffet for selecionado
    CUSTO_AJUDANTE_BUFFET: 80.00
};

// ===================================================
// NOVA CONSTANTE PARA AJUSTE DE PREÇO POR TIPO DE CORTE
// ===================================================

const MULTIPLICADORES_CORTE = {
    // Espetinho dá mais trabalho que inteira/fatiada, então multiplica o valor final da mão de obra
    inteira: 1.00,
    fatiada: 1.00,
    espetinho: 1.20 // Exemplo: Aumenta o custo da mão de obra em 20% se for espetinho
};
