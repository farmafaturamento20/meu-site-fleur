document.addEventListener('DOMContentLoaded', function () {
  const filtroButtons = document.querySelectorAll('.btn-filtro');
  const cards = document.querySelectorAll('.card-produto');
  const buscaInput = document.getElementById('inputBuscaProdutos');
  const btnBuscar = document.getElementById('btnBuscarProdutos');
  const listaCarrinho = document.getElementById('listaCarrinho');
  const totalCarrinho = document.getElementById('totalCarrinho');
  const btnCarrinhoFlutuante = document.getElementById('btnCarrinhoFlutuante');
  const carrinhoFlutuante = document.getElementById('carrinhoFlutuante');
  const btnFecharCarrinho = document.getElementById('btnFecharCarrinho');
  const badgeCarrinho = document.getElementById('badgeCarrinho');

  let categoriaAtiva = 'todos';
  let termoBusca = '';
  let carrinho = [];

  function alternarCarrinho() {
    if (!carrinhoFlutuante) return;
    const aberto = carrinhoFlutuante.classList.contains('aberto');
    carrinhoFlutuante.classList.toggle('aberto', !aberto);
  }

  function formatarReal(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  function atualizarFiltro() {
    cards.forEach((card) => {
      const categoria = card.dataset.categoria || '';
      const nome = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const matchCategoria = categoriaAtiva === 'todos' || categoria === categoriaAtiva;
      const matchBusca = nome.includes(termoBusca);
      const visible = matchCategoria && matchBusca;
      card.style.display = visible ? 'flex' : 'none';
    });
  }

  filtroButtons.forEach((botao) => {
    botao.addEventListener('click', function () {
      categoriaAtiva = this.dataset.categoria || 'todos';

      filtroButtons.forEach((btn) => {
        btn.classList.toggle('ativo', btn === this);
      }, this);

      atualizarFiltro();
    });
  });

  function aplicarBusca() {
    termoBusca = buscaInput ? buscaInput.value.trim().toLowerCase() : '';
    atualizarFiltro();
  }

  if (buscaInput) {
    buscaInput.addEventListener('input', aplicarBusca);
  }

  if (btnBuscar) {
    btnBuscar.addEventListener('click', aplicarBusca);
  }

  function renderCarrinho() {
    if (!listaCarrinho || !totalCarrinho) return;

    if (carrinho.length === 0) {
      listaCarrinho.innerHTML = '<li class="carrinho-vazio">Seu carrinho está vazio.</li>';
      totalCarrinho.textContent = 'R$ 0,00';
    } else {
      listaCarrinho.innerHTML = '';

      carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${item.nome}</span>
          <span>${formatarReal(item.preco)}</span>
          <button class="btn-remover" aria-label="Remover ${item.nome}" data-index="${index}">×</button>
        `;
        listaCarrinho.appendChild(li);
      });

      const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
      totalCarrinho.textContent = formatarReal(total);

      const botoesRemover = document.querySelectorAll('.btn-remover');
      botoesRemover.forEach((botao) => {
        botao.addEventListener('click', function () {
          const index = Number(this.dataset.index);
          carrinho.splice(index, 1);
          renderCarrinho();
        });
      });
    }

    if (badgeCarrinho) {
      badgeCarrinho.textContent = String(carrinho.length);
    }

    if (carrinho.length > 0 && carrinhoFlutuante && !carrinhoFlutuante.classList.contains('aberto')) {
      carrinhoFlutuante.classList.add('aberto');
    }
  }

  if (btnCarrinhoFlutuante) {
    btnCarrinhoFlutuante.addEventListener('click', alternarCarrinho);
  }

  if (btnFecharCarrinho) {
    btnFecharCarrinho.addEventListener('click', function () {
      carrinhoFlutuante?.classList.remove('aberto');
    });
  }

  window.adicionarAoCarrinho = function (nome, preco) {
    carrinho.push({ nome, preco });
    renderCarrinho();
  };

  window.enviarWhatsApp = function () {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const mensagem = carrinho.map((item) => `${item.nome} - ${formatarReal(item.preco)}`).join(', ');
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    const texto = encodeURIComponent(`Olá! Gostaria de comprar: ${mensagem}. Total: ${formatarReal(total)}`);
    window.open(`https://wa.me/5511999999999?text=${texto}`, '_blank');
  };

  renderCarrinho();
  atualizarFiltro();
});
