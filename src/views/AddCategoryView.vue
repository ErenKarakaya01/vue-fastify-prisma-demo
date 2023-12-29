<template>
  <div>
    <h1>Add Category</h1>
    <form @submit.prevent="handleSubmit">
      <input type="file" @change="handleFileChange" accept="image/*" />
      <input v-model="name" placeholder="Category Name" /><br />
      <textarea v-model="parent_id" placeholder="Parent Id"></textarea><br />
      <button type="submit">Upload Category</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ImageUpload',
  data() {
    return {
      name: '',
      parent_id: '',
      selectedFile: null
    }
  },
  methods: {
    async handleFileChange(event) {
      this.selectedFile = event.target.files[0]
    },
    async handleSubmit() {
      if (!this.selectedFile || !this.name || !this.parent_id) {
        console.log(this.selectedFile, this.name, this.parent_id)
        console.error('Please fill in all fields')
        return
      }

      // Read the uploaded image file
      const reader = new FileReader()
      reader.readAsDataURL(this.selectedFile)
      reader.onload = async () => {
        const image = new Image()
        image.src = reader.result
        image.onload = async () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Resize the image to 3200x3200
          const scaleFactor = Math.min(1, 3200 / image.width, 3200 / image.height)
          canvas.width = image.width * scaleFactor
          canvas.height = image.height * scaleFactor

          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

          // Convert the resized image back to a File object
          canvas.toBlob(
            async (blob) => {
              const resizedFile = new File([blob], this.selectedFile.name, { type: 'image/jpeg' })

              // Here, you can send the resizedFile to your backend API using Axios, Fetch, etc.
              // For example, using Axios:
              const formData = new FormData()

              formData.append('name', this.name)
              formData.append('parent_id', this.parent_id)
              formData.append('image', resizedFile)

              try {
                const response = await axios.post('http://127.0.0.1:8080/categories', formData)

                console.log(response.data) // Response from the backend
              } catch (error) {
                console.error('Error uploading product:', error)
              }
            },
            'image/jpeg',
            0.9
          ) // Adjust image quality as needed
        }
      }
    }
  }
}
</script>
