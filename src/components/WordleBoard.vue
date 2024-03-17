<script setup lang="ts">
import { VICTORY_MESSAGE } from './strings';
defineProps<{
  wordOfTheDay: string
}>()
</script>

<template>
  <input type="text" >
  <p>{{ VICTORY_MESSAGE }}</p>
  <p>{{ wordOfTheDay }}</p>
</template>

<style scoped>

</style>
