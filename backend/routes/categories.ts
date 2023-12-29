// categories.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import util from 'util'
import { pipeline } from 'stream'
import { MultipartFile } from "@fastify/multipart"

const pump = util.promisify(pipeline)

const prisma = new PrismaClient()

export default async function (fastify: FastifyInstance) {
  // Get all categories
  fastify.get('/categories', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await prisma.category.findMany()
      return categories
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  fastify.get('/categories/tree', async (request: FastifyRequest, reply: FastifyReply) => {
    const getCategoriesTree = async () => {
      interface Category {
        id: number
        name: string
        picture: string | null
        parent_id: number | null
        created_at: Date
        updated_at: Date
        children?: Category[]
      }

      const categories = await prisma.category.findMany()

      const categoriesTree: Category[] = []

      for (const category of categories) {
        if (category.parent_id === null) {
          categoriesTree.push(category)
        }
      }

      const addChildrenCategories = (category: Category) => {
        category.children = []
        for (const childCategory of categories) {
          if (childCategory.parent_id === category.id) {
            category.children.push(childCategory)
          }
        }
        for (const childCategory of category.children) {
          addChildrenCategories(childCategory)
        }
      }

      for (const category of categoriesTree) {
        addChildrenCategories(category)
      }

      return categoriesTree
    }

    try {
      const categoriesTree = await getCategoriesTree()
      return categoriesTree
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Show count of products of recursive children categories
  fastify.get('/categories/:id/count', async (request: FastifyRequest, reply: FastifyReply) => {
    const categoryId = parseInt(
      (request as FastifyRequest<{ Params: { id: string } }>).params.id,
      10
    )

    try {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })

      if (!category) {
        reply.code(404).send({ error: 'Category not found' })
        return
      }

      interface Category {
        id: number
        name: string
        picture: string | null
        parent_id: number | null
        created_at: Date
        updated_at: Date
      }

      const calculateProductCount = async (category: Category) => {
        const childrenCategories = await prisma.category.findMany({
          where: { parent_id: category.id }
        })
        console.log(childrenCategories)

        if (childrenCategories.length === 0) {
          const count = await prisma.product.count({
            where: { category_id: category.id }
          })
          return count
        }

        let count = 0
        for (const childCategory of childrenCategories) {
          count += await calculateProductCount(childCategory)
        }
        return count
      }

      const count = await calculateProductCount(category)

      return count
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Get a single category by ID
  fastify.get('/categories/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const categoryId = parseInt(
      (request as FastifyRequest<{ Params: { id: string } }>).params.id,
      10
    )

    try {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })

      if (!category) {
        reply.code(404).send({ error: 'Category not found' })
        return
      }

      return category
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Create a new category
  fastify.post('/categories', async (request: FastifyRequest, reply: FastifyReply) => {
    const { image, name, parent_id } = request.body as {
      image: MultipartFile
      name: {
        value: string
      }
      parent_id: {
        value: string
      }
    }

    if (!name || !parent_id) {
      reply.code(400).send({ error: 'Missing name or parent_id' })
      return
    }

    const date = new Date().getMilliseconds()

    await pump(image.file, fs.createWriteStream(`./public/images/${date + image.filename}`))

    if (!name || !parent_id) {
      reply.code(400).send({ error: 'Missing name or parent_id' })
      return
    }
    
    try {
      const newCategory = await prisma.category.create({
        data: {
          name: name.value,
          picture: "/public/images/" + date + image.filename,
          parent_id: parseInt(parent_id.value),
          created_at: new Date()
        }
      })
      return newCategory
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Update a category
  fastify.put('/categories/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const categoryId = parseInt(
      (request as FastifyRequest<{ Params: { id: string } }>).params.id,
      10
    )

    const { name, picture, parent_id } = request.body as {
      name: string
      picture: string
      parent_id: number
    }

    try {
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: {
          name,
          picture,
          parent_id,
          updated_at: new Date()
        }
      })
      return updatedCategory
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  // Delete a category
  fastify.delete('/categories/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const categoryId = parseInt(
      (request as FastifyRequest<{ Params: { id: string } }>).params.id,
      10
    )

    try {
      const deletedCategory = await prisma.category.delete({
        where: { id: categoryId }
      })
      return deletedCategory
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })
}
