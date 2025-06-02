// Seleciona os elementos do DOM
const pokemonInput = document.getElementById('pokemonInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const pokemonCard = document.getElementById('pokemonCard');
const pokemonName = document.getElementById('pokemonName');
const pokemonNumber = document.getElementById('pokemonNumber');
const pokemonSprite = document.getElementById('pokemonSprite');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');
const pokemonTypes = document.getElementById('pokemonTypes');

// Função para buscar o Pokémon na API
async function fetchPokemon(query) {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    pokemonCard.classList.add('hidden');

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        if (!response.ok) throw new Error('Pokémon não encontrado');
        const data = await response.json();

        // Preenche os dados no card
        pokemonName.textContent = data.name;
        pokemonNumber.textContent = `#${String(data.id).padStart(3, '0')}`;
        pokemonSprite.src = data.sprites.front_default;
        pokemonSprite.alt = `Sprite de ${data.name}`;
        pokemonHeight.textContent = (data.height / 10) + ' m';
        pokemonWeight.textContent = (data.weight / 10) + ' kg';
        pokemonTypes.textContent = data.types.map(type => type.type.name).join(', ');

        pokemonCard.classList.remove('hidden');
    } catch (e) {
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

// Evento de clique no botão
searchBtn.addEventListener('click', () => {
    const query = pokemonInput.value.trim();
    if (query) fetchPokemon(query);
});

// Permite buscar pressionando Enter
pokemonInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = pokemonInput.value.trim();
        if (query) fetchPokemon(query);
    }
});
