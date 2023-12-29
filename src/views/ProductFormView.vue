<!-- ProductForm.vue -->

<template>
  <div>
    <h1>Product Form</h1>
    <div>
      <label for="parentCategory">Top Parent Category:</label>
      <select v-model="selectedParentCategory" @change="parentCategoryChanged">
        <option v-for="parentCategory in topParentCategories" :value="parentCategory.id" :key="parentCategory.id">
          {{ parentCategory.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="childCategory">Child Category:</label>
      <select v-model="selectedChildCategory">
        <option v-for="childCategory in selectedParentCategoryChildren" :value="childCategory.id" :key="childCategory.id">
          {{ childCategory.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductForm',
  data() {
    return {
      topParentCategories: [], // Holds top-level parent categories
      selectedParentCategory: null, // Selected top parent category
      selectedParentCategoryChildren: [] // Holds children of the selected parent category
    };
  },
  // Fetch top-level parent categories from the backend API
  async created() {
    try {
      const response = await fetch('http://127.0.0.1:8080/categories/tree'); // Adjust the API endpoint URL
      const categoriesTree = await response.json();

      // Assuming categoriesTree is an array of categories with children
      this.topParentCategories = categoriesTree;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },
  methods: {
    parentCategoryChanged() {
      // Update selectedParentCategoryChildren when the parent category selection changes
      if (this.selectedParentCategory) {
        const selectedCategory = this.findCategoryById(this.selectedParentCategory, this.topParentCategories);
        if (selectedCategory) {
          this.selectedParentCategoryChildren = selectedCategory.children || [];
        }
      }
    },
    findCategoryById(id, categories) {
      // Function to find a category by ID in the categories tree
      for (const category of categories) {
        if (category.id === id) {
          return category;
        }
        if (category.children) {
          const found = this.findCategoryById(id, category.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    }
  }
};
</script>
