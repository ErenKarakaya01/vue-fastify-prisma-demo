<template>
  <div>
    <h1>Category Tree</h1>
    <category-tree :categories="categoriesTree" />
  </div>
</template>

<script>
import CategoryTree from '../components/CategoryTree.vue'; // Import the CategoryTree component

export default {
  name: 'App',
  components: {
    CategoryTree // Register the CategoryTree component
  },
  data() {
    return {
      categoriesTree: [] // Assign fetched categories data here
    };
  },
  // Fetch categories data from the backend API (using Axios, Fetch, etc.)
  async created() {
    try {
      const response = await fetch('http://127.0.0.1:8080/categories/tree'); // Adjust the API endpoint URL
      this.categoriesTree = await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
};
</script>
