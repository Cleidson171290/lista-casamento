const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware para permitir requisições de origens diferentes (do seu index.html para o servidor)
app.use(cors());
// Middleware para entender o corpo das requisições como JSON
app.use(express.json());

const dataFilePath = "./data.json";

// Rota para obter todos os itens da lista
app.get("/api/itens", (req, res) => {
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Erro ao ler a lista de presentes.");
    }
    res.json(JSON.parse(data));
  });
});

// Rota para escolher um item
app.post("/api/escolher-item", (req, res) => {
  const { item: itemName, nome: personName } = req.body;

  if (!itemName || !personName) {
    return res.status(400).send("Nome do item e da pessoa são obrigatórios.");
  }

  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Erro ao ler os dados.");
    }

    const giftData = JSON.parse(data);
    const item = giftData.itens.find((i) => i.nome === itemName);

    if (!item) {
      return res.status(404).send("Item não encontrado.");
    }

    if (item.escolhido) {
      return res.status(400).send("Este item já foi escolhido.");
    }

    item.escolhido = true;
    item.por = personName;

    // Notificação no console do servidor
    console.log(`------------------------------------`);
    console.log(`🎁 Novo Presente Escolhido!`);
    console.log(`   Item: ${itemName}`);
    console.log(`   Por: ${personName}`);
    console.log(`------------------------------------`);

    fs.writeFile(dataFilePath, JSON.stringify(giftData, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Erro ao salvar a escolha.");
      }
      res.status(200).json({ message: "Item escolhido com sucesso!", item });
    });
  });
});

app.listen(port, () => {
  console.log(
    `Servidor da lista de presentes rodando em http://localhost:${port}`
  );
});
