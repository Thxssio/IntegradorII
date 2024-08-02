// Simulação de variável de status da bomba
let bombaLigada = false;

// Função para alternar o estado da bomba
function toggleBomba() {
    const statusElement = document.getElementById('status');
    const toggleButton = document.getElementById('toggleButton');

    // Alterna o estado da bomba
    bombaLigada = !bombaLigada;

    if (bombaLigada) {
        statusElement.textContent = 'Status: Ligado';
        toggleButton.textContent = 'Desligar';
    } else {
        statusElement.textContent = 'Status: Desligado';
        toggleButton.textContent = 'Ligar';
    }

    // Adiciona uma entrada ao histórico
    addToHistory(statusElement.textContent);
}

// Função para adicionar entrada ao histórico
function addToHistory(status) {
    const historyList = document.getElementById('statusHistory');
    const li = document.createElement('li');
    li.textContent = `${new Date().toLocaleString()}: ${status}`;
    historyList.prepend(li); // Adiciona no início da lista
}
