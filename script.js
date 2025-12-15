// DADOS DOS LIVROS
const livros = {
    domquixote: {
        title: "Dom Quixote",
        img: "img/dom_quixote.png",
        price: "99.90",
        desc: "Dom Quixote, escrito por Miguel de Cervantes...",
        sold: 50321,
        tags: ["Clássico", "Aventura", "Literatura Mundial"]
    },
    hp1: {
        title: "Harry Potter e a Pedra Filosofal",
        img: "img/harry3.jpeg",
        price: "59.90",
        desc: "Harry Potter e a Pedra Filosofal, de J.K. Rowling...",
        sold: 30892,
        tags: ["Fantasia", "Magia", "Juvenil"]
    },
    dorian: {
        title: "O Retrato de Dorian Gray",
        img: "img/doriangray7.jpg",
        price: "49.90",
        desc: "O Retrato de Dorian Gray, de Oscar Wilde...",
        sold: 22140,
        tags: ["Clássico", "Drama", "Reflexivo"]
    }
};

const params = new URLSearchParams(location.search);
const bookID = params.get("book");
const livro = livros[bookID];

// ESTOQUE ALEATÓRIO
const estoque = Math.floor(Math.random() * 10) + 1;
let estoqueTexto =
    estoque > 5 ? "🟢 Em estoque" :
    estoque > 2 ? "⚠️ Poucas unidades restantes!" :
    "🔴 Últimas unidades!";

// ESTRELAS
const media = (Math.random() * 2 + 3).toFixed(1);
const estrelas = "⭐".repeat(Math.round(media));

// CARROSSEL DE RECOMENDADOS
let recomendadosHTML = "";
Object.keys(livros).forEach(id => {
    if (id !== bookID) {
        const l = livros[id];
        recomendadosHTML += `
            <div class="carousel-item">
                <img src="${l.img}">
                <p><strong>${l.title}</strong></p>
                <p>R$ ${l.price}</p>
            </div>
        `;
    }
});

// Função para aplicar cupom de desconto
async function aplicarCupom() {
    const cupom = document.getElementById("couponInput").value;

    try {
        const response = await fetch(`https://api.discountapi.com/v1/coupons/${cupom}`);
        const data = await response.json();

        if (data.valid) {
            const desconto = data.discount;
            const novoPreco = (livro.price - desconto).toFixed(2);
            document.getElementById("precoComDesconto").textContent = `Preço com desconto: R$ ${novoPreco}`;
        } else {
            alert("Cupom inválido.");
        }
    } catch (erro) {
        alert("Erro ao aplicar cupom.");
    }
}

// Função para carregar avaliações reais (Trustpilot API exemplo)
async function carregarAvaliacoes() {
    const livroId = livro.title; // Você pode usar um ID real
    const response = await fetch(`https://api.trustpilot.com/v1/business-units/${livroId}/reviews`, {
        headers: {
            "Authorization": "Bearer SUA_CHAVE_DE_API_AQUI" // Substitua pela sua chave da API
        }
    });
    
    const data = await response.json();
    
    let comentariosHTML = "";
    data.reviews.forEach((avaliacao) => {
        comentariosHTML += `
            <div class="comment">
                <p><strong>${avaliacao.reviewer.name}</strong></p>
                <p class="stars">${"⭐".repeat(avaliacao.rating)}</p>
                <p>${avaliacao.text}</p>
            </div>
        `;
    });

    document.querySelector(".comments").innerHTML = comentariosHTML;
}

// Chama a função para carregar as avaliações ao carregar a página
carregarAvaliacoes();

document.getElementById("content").innerHTML = `
    <img src="${livro.img}" class="book-img">

    <div class="book-info">
        <span class="selo">📚 Mais vendido da categoria</span>

        <h2>${livro.title}</h2>

        <p class="stars">${estrelas} (${media})</p>

        <p>${livro.desc}</p>
        <p><strong>${livro.sold.toLocaleString()}</strong> compras</p>

        <div class="estoque">${estoqueTexto}</div>

        <p class="price">R$ ${livro.price}</p>

        <div class="tags">
            ${livro.tags.map(t => `<span>${t}</span>`).join("")}
        </div>

        <div class="cupom">
            <input type="text" id="couponInput" placeholder="Digite seu cupom de desconto">
            <button onclick="aplicarCupom()">Aplicar</button>
            <p id="precoComDesconto"></p>
        </div>

        <a href="compra.html?book=${bookID}">
            <button class="buy-btn">Comprar Agora</button>
        </a>

        <div class="comments">
            <h3>Avaliações dos leitores</h3>
            <!-- Avaliações reais serão carregadas aqui -->
        </div>

        <div class="carousel">
            <h3>Clientes também compraram</h3>
            <div class="carousel-container">
                ${recomendadosHTML}
            </div>
        </div>
    </div>
