<script setup lang="ts">
defineProps<{
  wordOfTheDay: string
}>()
</script>

<template>
  <input type="text" >
  <p>You won!</p>
  <p>{{ wordOfTheDay }}</p>
</template>

<style scoped>

</style>