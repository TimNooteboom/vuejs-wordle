<script setup lang="ts">
import { FAILURE_MESSAGE, VICTORY_MESSAGE, WORD_SIZE } from './strings'
import englishWords from './englishWordsWith5Letters.json'
import { computed, ref } from 'vue'

defineProps({ 
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessInProgress = ref<string|null>(null)
const guessSubmitted = ref('')

const formattedGuessInProgress = computed<string>({
  get() { 
    return guessInProgress.value ?? ""
  },
  set(newValue: string) {
    guessInProgress.value = null

    guessInProgress.value = newValue
      .slice(0, WORD_SIZE)
      .toUpperCase()
      .replace(/[^A-Z]+/gi, '')
      // .replace(/[^A-Z]/g, '')
  }
})

function onSubmit() {
  if(englishWords.includes(formattedGuessInProgress.value)) {
    guessSubmitted.value = formattedGuessInProgress.value
  }
}

</script>

<template>
  {{ guessInProgress }}<br/>
  <input type="text" 
    v-model="formattedGuessInProgress" 
    :maxlength="WORD_SIZE" 
    @keydown.enter="onSubmit"
  >

  <p v-if="guessSubmitted" 
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : FAILURE_MESSAGE">
  </p>


</template>

<style scoped>

</style>
