<script setup lang="ts">
  import { FAILURE_MESSAGE, MAX_GUESSES, VICTORY_MESSAGE } from './strings'
  import englishWords from './englishWordsWith5Letters.json'
  import { ref, computed } from 'vue'
  import GuessInput from './GuessInput.vue'

  const props = defineProps({ 
    wordOfTheDay: {
      type: String,
      required: true,
      validator: (wordGiven: string) => englishWords.includes(wordGiven)
    }
  })

  const guessesSubmitted = ref<string[]>([])

  const hasGameEnded = computed(() => 
    guessesSubmitted.value.length === MAX_GUESSES || 
    guessesSubmitted.value.includes(props.wordOfTheDay))

</script>

<template>
  <main>
    <ul>
      <li v-for="(guess, index) in guessesSubmitted" :key="`${index}-${guess}`">
        {{ guess }}
      </li>
    </ul>
    {{ guessesSubmitted }}
    <GuessInput @guess-submitted = "(guess: any) => guessesSubmitted.push(guess)" />

    <p v-if="hasGameEnded" 
      v-text="guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : FAILURE_MESSAGE">
    </p>
  </main>
</template>

<style scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
  }

  .end-of-game-message {
    font-size: 3rem;
    animation: end-of-game-message-animation 700ms forwards;
    white-space: nowrap;
    text-align: center;
  }

  @keyframes end-of-game-message-animation {
    0% {
      opacity: 0;
      transform: rotateZ(0);
    }
    100% {
      opacity: 1;
      transform: translateY(2rem);
    }
  }
</style>
