<script setup lang="ts">
import { FAILURE_MESSAGE, VICTORY_MESSAGE } from './strings';
defineProps<{
  wordOfTheDay: string
}>()
</script>

<template>
  <input type="text" >
  <p>{{ VICTORY_MESSAGE }}</p>
  <p>{{ FAILURE_MESSAGE }}</p>
  <p>{{ wordOfTheDay }}</p>
</template>

<style scoped>

</style>
