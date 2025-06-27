const apiUrl = "https://lista-casamento-y4zd.onrender.com/api";

// Função para carregar e exibir os itens da lista
async function carregarItens() {
  try {
    const response = await fetch(`${apiUrl}/itens`);
    const data = await response.json();
    const listaPresentes = document.getElementById("listaPresentes");
    listaPresentes.innerHTML = ""; // Limpa a lista antes de adicionar os itens

    data.itens.forEach((item) => {
      const li = document.createElement("li");
      li.setAttribute("data-item", item.nome);
      li.textContent = item.nome;

      if (item.escolhido) {
        li.classList.add("escolhido");
        li.textContent += ` (Escolhido por: ${item.por})`;
      } else {
        li.onclick = () => marcarItem(li);
      }

      listaPresentes.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar a lista de presentes:", error);
    alert(
      "Não foi possível carregar a lista de presentes. Verifique se o servidor está rodando."
    );
  }
}

// Função para marcar um item como escolhido
async function marcarItem(itemElement) {
  if (itemElement.classList.contains("escolhido")) {
    alert("Este item já foi escolhido.");
    return;
  }

  const nome = prompt("Para registrar o presente, por favor, digite seu nome:");

  if (nome && nome.trim() !== "") {
    const itemName = itemElement.getAttribute("data-item");
    let confirmacao = confirm(
      `Tem certeza que deseja marcar "${itemName}" como presenteado em nome de ${nome}?`
    );

    if (confirmacao) {
      try {
        const response = await fetch(`${apiUrl}/escolher-item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ item: itemName, nome: nome }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData);
        }

        // Recarrega a lista para mostrar o status atualizado para todos
        carregarItens();
      } catch (error) {
        console.error("Erro ao marcar o item:", error);
        alert(`Ocorreu um erro: ${error.message}`);
      }
    }
  }
}

// Carrega os itens assim que a página é aberta
window.onload = carregarItens;
