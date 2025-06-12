document.addEventListener('DOMContentLoaded', () => {
    const extensionsGrid = document.getElementById('extensions-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let allExtensions = []; // Armazena todas as extensões

    // 1. BUSCAR DADOS DO JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allExtensions = data;
            renderExtensions(allExtensions);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));

    // 2. FUNÇÃO PARA RENDERIZAR OS CARDS
    const renderExtensions = (extensions) => {
        extensionsGrid.innerHTML = ''; // Limpa a grade antes de renderizar
        
        extensions.forEach((ext, index) => {
            // Se a extensão foi removida (marcada como null), não a renderize
            if (!ext) return;

            const card = document.createElement('div');
            card.className = 'extension-card';
            // Usamos o índice original do array como identificador
            card.dataset.index = allExtensions.indexOf(ext); 

            if (!ext.isActive) {
                card.classList.add('inactive');
            }

            card.innerHTML = `
                <div class="card-header">
                    <img src="${ext.logo}" alt="${ext.name}" class="icon">
                    <div class="info">
                        <h3>${ext.name}</h3>
                        <p>${ext.description}</p>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="remove-btn">Remove</button>
                    <label class="toggle-switch">
                        <input type="checkbox" ${ext.isActive ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            `;
            extensionsGrid.appendChild(card);
        });

        // Adiciona os event listeners após renderizar
        addEventListeners();
    };

    // 3. FUNÇÃO PARA ADICIONAR EVENT LISTENERS
    const addEventListeners = () => {
        // REMOVER EXTENSÃO
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.extension-card');
                const indexToRemove = parseInt(card.dataset.index, 10);
                
                // Marca o item como nulo no array original em vez de filtrar,
                // para não bagunçar os índices dos outros itens.
                allExtensions[indexToRemove] = null;
                
                // Remove do DOM
                card.remove(); 
            });
        });

        // ATIVAR/DESATIVAR EXTENSÃO (TOGGLE)
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const card = e.target.closest('.extension-card');
                const indexToToggle = parseInt(card.dataset.index, 10);
                const isChecked = e.target.checked;

                // Atualiza o estado no array original
                const extension = allExtensions[indexToToggle];
                if (extension) {
                    extension.isActive = isChecked;
                }
                
                // Atualiza a classe visual
                card.classList.toggle('inactive', !isChecked);
            });
        });
    };

    // 4. LÓGICA DOS FILTROS
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;
            // Filtra o array removendo os itens nulos (removidos) antes de aplicar o filtro de status
            const currentExtensions = allExtensions.filter(ext => ext !== null);
            let filteredExtensions = [];

            if (filter === 'all') {
                filteredExtensions = currentExtensions;
            } else if (filter === 'active') {
                filteredExtensions = currentExtensions.filter(ext => ext.isActive);
            } else if (filter === 'inactive') {
                filteredExtensions = currentExtensions.filter(ext => !ext.isActive);
            }
            
            renderExtensions(filteredExtensions);
        });
    });
});
