// products.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { MultipartFile } from "@fastify/multipart"
import fs from 'fs'
import util from 'util'
import { pipeline } from 'stream'

const pump = util.promisify(pipeline)

const prisma = new PrismaClient()

export default async function (fastify: FastifyInstance) {
  // Get all products
  fastify.get('/products', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const products = await prisma.product.findMany()
      return products
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Get a single product by ID
  fastify.get('/products/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const productId = parseInt((request as FastifyRequest<{ Params: { id: string } }>).params.id, 10)

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        reply.code(404).send({ error: 'Product not found' })
        return
      }

      return product
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Create a new product
  fastify.post('/products', async (request: FastifyRequest, reply: FastifyReply) => {
    const { image, name, category_id } = request.body as {
      image: MultipartFile
      name: {
        value: string
      }
      category_id: {
        value: string
      }
    }

    if (!name || !category_id) {
      reply.code(400).send({ error: 'Missing name or category_id' })
      return
    }

    const date = new Date().getMilliseconds()

    await pump(image.file, fs.createWriteStream(`./public/images/${date + image.filename}`))

    if (!name || !category_id) {
      reply.code(400).send({ error: 'Missing name or category_id' })
      return
    }
    
    try {
      const newProduct = await prisma.product.create({
        data: {
          name: name.value,
          picture: "/public/images/" + date + image.filename,
          category_id: parseInt(category_id.value),
          created_at: new Date()
        }
      })
      return newProduct
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Update a product
  fastify.put('/products/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const productId = parseInt((request as FastifyRequest<{ Params: { id: string } }>).params.id, 10)

    const { name, picture, category_id } = request.body as {
      name: string
      picture: string
      category_id: number
    }

    try {
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          picture,
          category_id,
          updated_at: new Date()
        }
      })
      return updatedProduct
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Delete a product
  fastify.delete('/products/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const productId = parseInt((request as FastifyRequest<{ Params: { id: string } }>).params.id, 10)

    try {
      const deletedProduct = await prisma.product.delete({
        where: { id: productId }
      })
      return deletedProduct
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })
}
