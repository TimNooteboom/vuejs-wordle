<script setup lang="ts">
import { FAILURE_MESSAGE, VICTORY_MESSAGE } from './strings'
import englishWords from './englishWordsWith5Letters.json'
import { computed, ref } from 'vue'

defineProps({ 
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessInProgress = ref('')
const guessSubmitted = ref('')

const formattedGuessInProgress = computed({
  get: () => guessInProgress.value,
  set: (newValue: string) => guessInProgress.value = newValue.slice(0, 5)
})

</script>

<template>
  <input type="text" v-model="formattedGuessInProgress" maxlength="5" @keydown.enter="guessSubmitted = guessInProgress">

  <p v-if="guessSubmitted" 
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : FAILURE_MESSAGE">
  </p>


</template>

<style scoped>

</style>
