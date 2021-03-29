const express = require("express")
const server = express()
const routes = require("./routes")

// habilitar arquivos estáticos
server.use(express.static("public"))

server.use(routes)
server.listen(3000, () => console.log('Rodando o server na porta 3000'))