<script setup lang="ts">
import { FAILURE_MESSAGE, VICTORY_MESSAGE } from './strings'
import { ref } from 'vue'

defineProps({ 
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => wordGiven.length === 5 && wordGiven.toUpperCase() === wordGiven
  }
})

const guessInProgress = ref('')
const guessSubmitted = ref('')

</script>

<template>
  <input type="text" v-model="guessInProgress" @keydown.enter="guessSubmitted = guessInProgress">

  <p v-if="guessSubmitted" 
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : FAILURE_MESSAGE">
  </p>


</template>

<style scoped>

</style>
