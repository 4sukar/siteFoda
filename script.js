// ===== MODAL DE DETALHES DO LIVRO ===== //
const modalDetails = document.getElementById("book-details-modal");
const modalPurchase = document.getElementById("purchase-modal");

const detailsImg = document.getElementById("details-img");
const detailsTitle = document.getElementById("details-title");
const detailsDesc = document.getElementById("details-desc");
const detailsPrice = document.getElementById("details-price");

const closeDetails = document.getElementById("closeDetails");
const closePurchase = document.getElementById("closePurchase");

let livroSelecionado = null;

// Abrir modal ao clicar no livro
const livros = document.querySelectorAll(".livro");

livros.forEach(livro => {
    livro.addEventListener("click", () => {
        const title = livro.dataset.title;
        const price = livro.dataset.price;
        const img = livro.dataset.img;
        const desc = livro.dataset.desc;

        livroSelecionado = { title, price };

        detailsImg.src = img;
        detailsTitle.textContent = title;
        detailsDesc.textContent = desc;
        detailsPrice.textContent = `R$ ${price}`;

        modalDetails.classList.remove("hidden");
    });
});

// Fechar modal
closeDetails.onclick = () => modalDetails.classList.add("hidden");

// Quando clicar em comprar → abre modal compra
document.getElementById("buyBtn").onclick = () => {
    modalDetails.classList.add("hidden");
    modalPurchase.classList.remove("hidden");
};


// ========= API 1 — CEP =========
document.getElementById("cepSearch").addEventListener("click", async () => {
    const cep = document.getElementById("cepInput").value;
    const cepResult = document.getElementById("cepResult");

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);

        if (!response.ok) throw new Error("CEP não encontrado.");

        const data = await response.json();

        const frete = (Math.random() * 20 + 5).toFixed(2);

        cepResult.innerHTML = `
      Endereço: ${data.street}, ${data.city} - ${data.state}<br>
      Frete estimado: R$ ${frete}
    `;
    } catch (erro) {
        cepResult.textContent = "Erro ao buscar CEP.";
    }
});


// ========= API 2 — TAXAS =========
document.getElementById("taxBtn").addEventListener("click", async () => {
    const taxResult = document.getElementById("taxResult");

    try {
        const response = await fetch("https://brasilapi.com.br/api/taxas/v1");
        const data = await response.json();

        const taxa = data[0]; // primeira taxa

        taxResult.innerHTML = `
      Taxa aplicada (${taxa.nome}): ${taxa.valor}%
    `;
    } catch {
        taxResult.textContent = "Erro ao carregar taxas.";
    }
});

// ========= API 3 — entrega =========

document.getElementById("cepSearch").addEventListener("click", async () => {
    const cep = document.getElementById("cepInput").value;
    const cepResult = document.getElementById("cepResult");

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        if (!response.ok) throw new Error("CEP não encontrado.");
        const data = await response.json();

        // Simulando transportadoras
        const transportadoras = [
            { nome: "Correios", preco: (Math.random() * 15 + 5).toFixed(2), prazo: 3 },
            { nome: "Motoboy Express", preco: (Math.random() * 25 + 10).toFixed(2), prazo: 1 },
            { nome: "Transportadora Rápida", preco: (Math.random() * 20 + 8).toFixed(2), prazo: 2 }
        ];

        let freteHTML = transportadoras.map(t => 
            `${t.nome}: R$ ${t.preco} (Entrega em ${t.prazo} dias)`
        ).join("<br>");

        cepResult.innerHTML = `
            Endereço: ${data.street}, ${data.city} - ${data.state}<br>
            <strong>Opções de frete:</strong><br>
            ${freteHTML}
        `;
    } catch (erro) {
        cepResult.textContent = "Erro ao buscar CEP.";
    }
});

ocument.getElementById("currencyBtn").addEventListener("click", async () => {
    const currencyResult = document.getElementById("currencyResult");

    try {
        const response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL");
        if (!response.ok) throw new Error("Erro ao buscar cotação.");

        const data = await response.json();

        const dolar = parseFloat(data.USDBRL.ask).toFixed(2);
        const euro = parseFloat(data.EURBRL.ask).toFixed(2);
        const precoBRL = parseFloat(livroSelecionado.price);

        currencyResult.innerHTML = `
            Preço em BRL: R$ ${precoBRL} <br>
            Preço aproximado em USD: $ ${(precoBRL / dolar).toFixed(2)} <br>
            Preço aproximado em EUR: € ${(precoBRL / euro).toFixed(2)}
        `;
    } catch {
        currencyResult.textContent = "Erro ao buscar cotação.";
    }
});


// ========= PAGAMENTO FAKE =========
document.getElementById("payBtn").addEventListener("click", async () => {
    const payResult = document.getElementById("payResult");

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify({
                livro: livroSelecionado.title,
                preco: livroSelecionado.price,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        payResult.innerHTML = `
      Pagamento confirmado!<br>
      ID da transação PIX: <strong>${data.id}</strong>
    `;
    } catch {
        payResult.textContent = "Erro ao realizar pagamento.";
    }
});


// Fechar modal de compra
closePurchase.onclick = () => modalPurchase.classList.add("hidden");
