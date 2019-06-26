const http = require('http')
const app = require('./app')
const port = process.env.PORT || 3000

http.createServer(app)
   .on('listening', () => console.log(`Now listening on port: ${port}`))
   .listen(port)

