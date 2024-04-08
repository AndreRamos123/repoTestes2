<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta ao Cosmos DB</title>
</head>
<body>
    <h1>Consulta ao Cosmos DB</h1>
    <form id="queryForm">
        <label for="postId">ID do Post do Twitter:</label>
        <input type="text" id="postId" name="postId" required>
        <button type="submit">Consultar</button>
    </form>
    <div id="results"></div>

    <script>
        async function queryCosmosDB(postId) {
            const { CosmosClient } = require("@azure/cosmos");

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

            // Consulta para selecionar o post com o ID especificado
            const querySpec = {
                query: "SELECT * FROM c WHERE c.postId = @postId",
                parameters: [
                    { name: "@postId", value: postId }
                ]
            };

            // Executa a consulta
            const { resources: posts } = await container.items.query(querySpec).fetchAll();

            // Retorna o resultado
            return posts;
        }

        document.getElementById("queryForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const postId = document.getElementById("postId").value.trim();
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = ""; // Limpa os resultados anteriores

            try {
                const posts = await queryCosmosDB(postId);
                if (posts.length > 0) {
                    const resultList = document.createElement("ul");
                    posts.forEach(post => {
                        const listItem = document.createElement("li");
                        listItem.textContent = JSON.stringify(post);
                        resultList.appendChild(listItem);
                    });
                    resultsDiv.appendChild(resultList);
                } else {
                    resultsDiv.textContent = "Nenhum post encontrado com o ID especificado.";
                }
            } catch (error) {
                console.error("Erro ao consultar o Cosmos DB:", error);
                resultsDiv.textContent = "Erro ao consultar o Cosmos DB. Por favor, tente novamente mais tarde.";
            }
        });
    </script>
</body>
</html>
