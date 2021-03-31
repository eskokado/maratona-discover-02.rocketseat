const express = require("express")
const server = express()
const routes = require("./routes")

// usando template engine
server.set('view engine', 'ejs')

// habilitar arquivos estáticos
server.use(express.static("public"))

// usar o req.body
server.use(express.urlencoded({ extended: true }))

// routes
server.use(routes)

server.listen(3000, () => console.log('Rodando o server na porta 3000'))