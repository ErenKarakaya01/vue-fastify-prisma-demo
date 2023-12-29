<!-- CategoryTree.vue -->

<template>
  <ul>
    <li v-for="category in categories" :key="category.id">
      {{ category.name }}
      <category-tree v-if="category.children" :categories="category.children" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'CategoryTree',
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
}
</script>
