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
  // "toggle" usado quando precisa mudar alguma coisa de um estado pra outro, ex.: clicar - menu aparece, clicar - menu desaparece //

  function formatarReal(valor) { 
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
  // "Intel.NumberFormat" usada pra formatar numeros de acordo com um pais/idioma (precos, valores monetarios, porcentagens, numeros grandes) //

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
  // "to.LowerCase" pra fazer as letras ficaram minusculas //
  // "card.style.display = visible" pra definir qual propriedade do css ta sendo usada //

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
      // "appendChild" serve pra colocar um elemento dentro do outro no HTML //

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
    // "badgeCarrinho.textContent" contador do carrinho //

    if (carrinho.length > 0 && carrinhoFlutuante && !carrinhoFlutuante.classList.contains('aberto')) {
      carrinhoFlutuante.classList.add('aberto');
    }
  }
  // se o carrinho tiver aberto e com produtos, abre o carrinho flutuante (aparece na tela) //

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
  // "window" serve pro JavaScript acessar o ambiente de um site em algum navegador //

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
  // "encodeURIComponent" codifica um texto pra ser colocado com seguranca dentro de um URL //

  renderCarrinho();
  atualizarFiltro();
});

 document.addEventListener('DOMContentLoaded', function () {
            const slides = Array.from(document.querySelectorAll('.slide'));
            const dots = Array.from(document.querySelectorAll('.dot'));
            const nextButton = document.getElementById('btnProximo');
            const prevButton = document.getElementById('btnAnterior');
            let activeIndex = 0;
            let autoAdvanceTimer = null;
            // "DOMContentLoaded" significa que o HTML, depois de carregar, pode ser manipulado pelo JavaScript //
            // "activeIndex" pra indicar qual item ta ativo dentro de uma lista de itens //
            // "autoAdvanceTimer" (mesma logica do primeiro), ex.: controla o tempo pra trocar de imagem em um carrossel //

            function stopAutoAdvance() {
                if (autoAdvanceTimer) {
                    clearInterval(autoAdvanceTimer);
                    autoAdvanceTimer = null;
                }
            }
            // "clearInterval" usado pra parar um intervalo criado com setInterval() //
            // "stopAutoAdvance" interrompe o avanco automatico (carrossel) //

            function restartAutoAdvance() {
                stopAutoAdvance();
            // "restartAutoAdvance" reinicia o avanco automatico //

                const activeSlide = slides[activeIndex];
                const activeVideo = activeSlide?.querySelector('video');
                // "activeSlide" slide visivel //
                // "activeVideo" video visivel //

                if (activeVideo) {
                    activeVideo.currentTime = 0;
                    activeVideo.play();

                    activeVideo.onended = function () {
                        showSlide(activeIndex + 1);
                    };
                    return;
                }
                // "onended" quando termina o video //

                autoAdvanceTimer = setInterval(function () {
                    showSlide(activeIndex + 1);
                }, 5000);
            }

            function showSlide(index) {
                activeIndex = (index + slides.length) % slides.length;

                slides.forEach((slide, i) => {
                    const video = slide.querySelector('video');
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                        video.onended = null;
                    }
                    slide.classList.toggle('active', i === activeIndex);
                });

                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === activeIndex);
                });

                restartAutoAdvance();
            }

            nextButton?.addEventListener('click', function () {
                stopAutoAdvance();
                showSlide(activeIndex + 1);
            });

            prevButton?.addEventListener('click', function () {
                stopAutoAdvance();
                showSlide(activeIndex - 1);
            });

            dots.forEach((dot) => {
                dot.addEventListener('click', function () {
                    stopAutoAdvance();
                    showSlide(Number(dot.dataset.index));
                });
            });
            // "dots" pontos de navegacao que ficam embaixo de um banner, slides, videos e galerias //

            showSlide(0);
        });
        const dropdown = document.querySelector('.utilities-dropdown');
        const trigger = document.querySelector('.utility-head');
        // "dropdown" menu suspenso ou lista suspensa (menu/lista que abre e mostra opcoes) //
        // "trigger" dispara a funcao de um botao //

        if (dropdown && trigger) {
            const toggleMenu = (forceOpen) => {
                const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !dropdown.classList.contains('open');
                dropdown.classList.toggle('open', shouldOpen);
                trigger.setAttribute('aria-expanded', String(shouldOpen));
            };
            // "shouldOpen" 'deve abrir' //
            // "forceOpen" forcar abertura //

            trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleMenu();
            });
            // "stopPropagation" impede que um evento continue se propagando pelos elementos da pagina //

            trigger.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleMenu();
                }
            });

            document.addEventListener('click', () => toggleMenu(false));
        }

        const selectCliente = document.getElementById('cliente');
        const campoCpfCliente = document.getElementById('campoCpfCliente');

        if (selectCliente && campoCpfCliente) {
            const toggleCpfCliente = () => {
                const isCliente = selectCliente.value === 'sim';
                campoCpfCliente.style.display = isCliente ? 'block' : 'none';
                const cpfInput = document.getElementById('cpfCliente');
                if (!isCliente && cpfInput) {
                    cpfInput.value = '';
                }
            };

            selectCliente.addEventListener('change', toggleCpfCliente);
            toggleCpfCliente();
        }

        const linkTermos = document.querySelector('.link-termos');
        const modalTermos = document.getElementById('modalTermos');
        const modalClose = document.querySelector('.modal-close');
        // "modalClose" fechamento do modal ou elemento/acao responsavel por fechar o modal //

        if (linkTermos && modalTermos && modalClose) {
            const abrirModal = (event) => {
                event.preventDefault();
                modalTermos.classList.add('show');
                modalTermos.setAttribute('aria-hidden', 'false');
            };

            const fecharModal = () => {
                modalTermos.classList.remove('show');
                modalTermos.setAttribute('aria-hidden', 'true');
            };

            linkTermos.addEventListener('click', abrirModal);
            modalClose.addEventListener('click', fecharModal);

            modalTermos.addEventListener('click', (event) => {
                if (event.target === modalTermos) {
                    fecharModal();
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && modalTermos.classList.contains('show')) {
                    fecharModal();
                }
            });
        }