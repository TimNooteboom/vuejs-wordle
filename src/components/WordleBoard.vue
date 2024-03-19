<script setup lang="ts">
  import { FAILURE_MESSAGE, VICTORY_MESSAGE } from './strings'
  import englishWords from './englishWordsWith5Letters.json'
  import { ref } from 'vue'
  import GuessInput from './GuessInput.vue'

  defineProps({ 
    wordOfTheDay: {
      type: String,
      validator: (wordGiven: string) => englishWords.includes(wordGiven)
    }
  })

  const localGuessSubmitted = ref('')

</script>

<template>
  <GuessInput @guess-submitted = "(guess: any) => localGuessSubmitted = guess" />

  <p v-if="localGuessSubmitted" 
    v-text="localGuessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : FAILURE_MESSAGE">
  </p>


</template>

<style scoped>

</style>
