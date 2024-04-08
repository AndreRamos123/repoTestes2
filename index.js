const { CosmosClient } = require("@azure/cosmos");

async function main() {
  // Configurações do Cosmos DB
  const endpoint = "https://twitter-cosmosaccount.documents.azure.com:443/";
  const key = "4zTrd6aib1S7Jnya13diwxM9LBxkvUggZuGa5pNJZ1FCBz3j4vDvgMfgAg2HZdmqVpeMJALgd7VLACDbP0adIQ==";
  const databaseId = "TwitterDB";
  const containerId = "posts";

  // Cria um cliente Cosmos
  const client = new CosmosClient({ endpoint, key });

  // Referência ao banco de dados e contêiner
  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Consulta para selecionar todos os itens da tabela "posts"
  const querySpec = {
    query: "SELECT * FROM c"
  };

  // Executa a consulta
  const { resources: posts } = await container.items.query(querySpec).fetchAll();

  // Exibe os resultados
  console.log("Posts:");
  posts.forEach(post => {
    console.log(JSON.stringify(post));
  });
}

main().catch(err => {
  console.error(err);
});
