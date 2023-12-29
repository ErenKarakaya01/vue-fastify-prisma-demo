How to Run

Go to the root directory and backend folder and run the following code in the command line:

```
npm install
```

Go to the backend directory and run following:

```
npx prisma migrate dev --name init
```

In the backend folder, change the .env file database connection url with your url.

In the root directory, run the following:

```
npm run dev
```

Run the following line in another command prompt:

```
npx ts-node index.ts
```

Now you can go to following urls:

- http://127.0.0.1:5173/add-category
- http://127.0.0.1:5173/tree
- http://127.0.0.1:5173/parent-categories

![Screenshot_123](https://github.com/ErenKarakaya01/vue-fastify-prisma-demo/assets/58625563/3bdba85f-e4f9-4457-b990-d8844b7558f2)

![Screenshot_1234](https://github.com/ErenKarakaya01/vue-fastify-prisma-demo/assets/58625563/afe14d8e-4fb1-4a6b-9e93-7f4be9ff891c)

![Screenshot_12345](https://github.com/ErenKarakaya01/vue-fastify-prisma-demo/assets/58625563/30545edd-4df0-46ff-b738-5dd7ad67ba6c)


Also you can join my postman workspace and select the task and check the api status.
https://app.getpostman.com/join-team?invite_code=378093b260574d831ffc3a9d5c4b7873&target_code=ad19ac1fa2c3737aa80e88de81d08587

![Screenshot_3123456](https://github.com/ErenKarakaya01/vue-fastify-prisma-demo/assets/58625563/33c30b3b-6f56-4911-86b3-981a804ef476)
