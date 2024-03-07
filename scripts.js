document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const cnpj = document.getElementById('searchInput').value;
        searchAPI(cnpj);
    });
});

function searchAPI(term) {
    axios.get('https://brasilapi.com.br/api/cnpj/v1/' + term)
        .then(function(response) {
            displayResults(response.data);
        })
        .catch(function(error) {
            console.error('Erro ao buscar dados:', error);
        });
}

function formatCNPJ(cnpj) {
    // Verifica se o CNPJ tem a quantidade correta de dígitos
    if (cnpj.length !== 14) {
        return "CNPJ inválido";
    }

    // Formata o CNPJ com a pontuação adequada
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

function displayResults(data) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Limpa os resultados anteriores

    const card = document.createElement('div');
    card.classList.add('card', 'mt-3', 'custom-card-bg');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'custom-card-body-bg');

    // Cabeçalho
    const header = document.createElement('div');
    header.classList.add('card-header', 'bg-transparent');
    header.innerHTML = `<h5 class="card-title">Razão Social: ${data.razao_social}</h5><h6 class="card-subtitle mb-2 text-muted">CNPJ: ${formatCNPJ(data.cnpj)}</h6>`;
    cardBody.appendChild(header);

    // Conteúdo dos dados (inicialmente oculto)
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush', 'd-none');
    
    const itemsToShow = {
        'Nome Fantasia': data.nome_fantasia,
        'Logradouro': data.logradouro,
        'Número': data.numero,
        'Complemento': data.complemento,
        'Bairro': data.bairro,
        'Cidade': data.municipio,
        'UF': data.uf,
        'CEP': data.cep,
        'Socio': data.qsa[0].nome_socio
    };

    for (const key in itemsToShow) {
        if (Object.hasOwnProperty.call(itemsToShow, key)) {
            const value = itemsToShow[key];
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `${key}: ${value}`;
            ul.appendChild(li);
        }
    }

    cardBody.appendChild(ul);
    card.appendChild(cardBody);
    resultsDiv.appendChild(card);

    // Rodapé com botão de expandir e minimizar
    const footer = document.createElement('div');
    footer.classList.add('card-footer', 'bg-transparent');
    
    var expandButton = document.createElement('button');
    expandButton.classList.add('btn', 'btn-primary', 'mt-2', 'custom-btn-color');
    expandButton.textContent = 'Expandir';

    expandButton.addEventListener('click', function() {
        ul.classList.remove('d-none'); // Exibe a lista de itens
        expandButton.classList.add('d-none'); // Oculta o botão de expandir
        minimizeButton.classList.remove('d-none'); // Exibe o botão de minimizar
    });

    footer.appendChild(expandButton);

    var minimizeButton = document.createElement('button');
    minimizeButton.classList.add('btn', 'btn-secondary', 'mt-2', 'd-none');
    minimizeButton.textContent = 'Minimizar';

    minimizeButton.addEventListener('click', function() {
        ul.classList.add('d-none'); // Oculta a lista de itens
        expandButton.classList.remove('d-none'); // Exibe o botão de expandir
        minimizeButton.classList.add('d-none'); // Oculta o botão de minimizar
    });

    footer.appendChild(minimizeButton);
    cardBody.appendChild(footer);
}
