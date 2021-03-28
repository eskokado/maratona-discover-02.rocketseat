const express = require("express")
const server = express()

server.get('/', (request, response) => {
  return response.send('OLA update')
})

server.listen(3000, () => console.log('Rodando o server na porta 3000'))