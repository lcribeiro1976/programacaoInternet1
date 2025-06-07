const pokemonImg = document.getElementById('pokemon-image');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');

let currentPokemonName = '';

function getRandomId() {
    return Math.floor(Math.random() * 250) + 1;
}

async function carregarPokemon() {
    const id = getRandomId();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    pokemonImg.src = imageUrl;
    pokemonImg.classList.remove('revealed');
    guessInput.value = '';
    guessInput.disabled = false;
    submitBtn.disabled = false;
    nextBtn.disabled = true;

    // Buscar nome do Pokémon na PokeAPI
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        currentPokemonName = data.name;
    } catch (error) {
        console.error('Erro ao buscar dados do Pokémon:', error);
        currentPokemonName = '';
    }
}

submitBtn.addEventListener('click', () => {
    const guess = guessInput.value.trim().toLowerCase();
    if (guess === currentPokemonName.toLowerCase()) {
        pokemonImg.classList.add('revealed');
    }
    guessInput.disabled = true;
    submitBtn.disabled = true;
    nextBtn.disabled = false;
});

nextBtn.addEventListener('click', () => {
    carregarPokemon();
});

// Carregar o primeiro Pokémon ao iniciar
carregarPokemon();
