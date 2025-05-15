document.addEventListener('DOMContentLoaded', () => {
    const botoesAdicionar = document.querySelectorAll('.adicionar-carrinho');
    const listaCarrinho = document.querySelector('.lista-carrinho');
    const valorTotalElemento = document.querySelector('.valor-total');
    const botaoFinalizarCompra = document.querySelector('.finalizar-compra'); // Seleciona o botão de finalizar compra
    let carrinho = [];

    function adicionarAoCarrinho(evento) {
        const botao = evento.target;
        const cardElemento = botao.closest('.card');
        if (!cardElemento) {
            console.error("Elemento .card não encontrado!");
            return;
        }
        const id = parseInt(cardElemento.dataset.id);
        const nomeElemento = cardElemento.querySelector('.nome-card');
        const precoElemento = cardElemento.querySelector('.preco-card');
        const imagemElemento = cardElemento.querySelector('img');

        if (!nomeElemento || !precoElemento || !imagemElemento) {
            console.error("Nome, preço ou imagem do card não encontrados!");
            return;
        }

        const nome = nomeElemento.textContent;
        const precoTexto = precoElemento.textContent.replace('R$ ', '').replace(',', '.');
        const preco = parseFloat(precoTexto);
        const imagemSrc = imagemElemento.src;

        const itemNoCarrinho = carrinho.find(item => item.id === id);

        if (itemNoCarrinho) {
            itemNoCarrinho.quantidade++;
        } else {
            carrinho.push({ id, nome, preco, imagemSrc, quantidade: 1 });
        }

        atualizarCarrinho();
    }

    function removerDoCarrinho(id) {
        carrinho = carrinho.filter(item => item.id !== id);
        atualizarCarrinho();
    }

    function atualizarQuantidade(id, novaQuantidade) {
        const item = carrinho.find(item => item.id === id);
        if (item) {
            item.quantidade = Math.max(1, novaQuantidade);
            atualizarCarrinho();
        }
    }

    function renderizarCarrinho() {
        listaCarrinho.innerHTML = '';
        carrinho.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('item-carrinho');
            li.innerHTML = `
                <div class="item-detalhes">
                    <img src="${item.imagemSrc}" alt="${item.nome}">
                    <div>
                        <span class="nome-produto-carrinho">${item.nome}</span>
                        <span class="preco-unitario-carrinho">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                <div class="item-quantidade">
                    <button class="diminuir-quantidade" data-id="${item.id}">-</button>
                    <span class="quantidade-item">${item.quantidade}</span>
                    <button class="aumentar-quantidade" data-id="${item.id}">+</button>
                </div>
                <button class="item-remover" data-id="${item.id}">Remover</button>
            `;
            listaCarrinho.appendChild(li);
        });

        const botoesAumentar = listaCarrinho.querySelectorAll('.aumentar-quantidade');
        botoesAumentar.forEach(botao => {
            botao.addEventListener('click', () => {
                const id = parseInt(botao.dataset.id);
                const quantidadeElemento = botao.previousElementSibling;
                const novaQuantidade = parseInt(quantidadeElemento.textContent) + 1;
                atualizarQuantidade(id, novaQuantidade);
            });
        });

        const botoesDiminuir = listaCarrinho.querySelectorAll('.diminuir-quantidade');
        botoesDiminuir.forEach(botao => {
            botao.addEventListener('click', () => {
                const id = parseInt(botao.dataset.id);
                const quantidadeElemento = botao.nextElementSibling;
                const novaQuantidade = parseInt(quantidadeElemento.textContent) - 1;
                atualizarQuantidade(id, novaQuantidade);
            });
        });

        const botoesRemover = listaCarrinho.querySelectorAll('.item-remover');
        botoesRemover.forEach(botao => {
            botao.addEventListener('click', () => {
                const id = parseInt(botao.dataset.id);
                removerDoCarrinho(id);
            });
        });

        atualizarTotal();
    }

    function atualizarTotal() {
        const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
        valorTotalElemento.textContent = total.toFixed(2).replace('.', ',');
    }

    function atualizarCarrinho() {
        renderizarCarrinho();
        atualizarTotal();
    }

    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', adicionarAoCarrinho);
    });

    // Adiciona um event listener para o botão "Finalizar Compra"
    if (botaoFinalizarCompra) {
        botaoFinalizarCompra.addEventListener('click', () => {
            alert('Funcionalidade de finalizar compra será implementada aqui!');
            // Aqui você pode adicionar a lógica para processar a compra
            console.log('Itens no carrinho:', carrinho);
            console.log('Valor total:', valorTotalElemento.textContent);
        });
    } else {
        console.error("Botão 'Finalizar Compra' não encontrado!");
    }

    atualizarCarrinho();
});
