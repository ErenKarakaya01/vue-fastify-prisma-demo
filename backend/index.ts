import Fastify from 'fastify'
import categories from './routes/categories'
import products from './routes/products'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import path from 'path'

const server = Fastify()

server.register(fastifyFormBody)
server.register(fastifyStatic, {
  root: path.join(__dirname, 'public', 'images'), // Path to your image directory
  prefix: '/images/', // Set the prefix for the endpoint
})
server.register(multipart, { attachFieldsToBody: true })
server.register(cors, { origin: '*' })
server.register(categories)
server.register(products)

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
