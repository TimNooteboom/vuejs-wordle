<script setup lang="ts">
  import { FAILURE_MESSAGE, MAX_GUESSES, VICTORY_MESSAGE } from './strings'
  import englishWords from './englishWordsWith5Letters.json'
  import { ref, computed, provide } from 'vue'
  import GuessInput from './GuessInput.vue'
  import GuessView from './GuessView.vue'

  const wordOfTheDay: string = englishWords[Math.floor(Math.random() * englishWords.length)]
  console.log(wordOfTheDay)

  const guessesSubmitted = ref<string[]>([])

  const replayGame = () => {
    window.location.reload()
  }

  const hasGameEnded = computed(() => 
    guessesSubmitted.value.length === MAX_GUESSES || 
    guessesSubmitted.value.includes(wordOfTheDay))

  const countOfEmptyGuesses = computed(() => {
    const guessesRemaining = MAX_GUESSES - guessesSubmitted.value.length

    return hasGameEnded.value ? guessesRemaining : guessesRemaining - 1
  })

  provide('guessesSubmitted', guessesSubmitted)
</script>

<template>
  <main>
  <h1>Wordle</h1>
    <ul>
      <li v-for="(guess, index) in guessesSubmitted" :key="`${index}-${guess}`">
        <GuessView :guess="guess" :answer="wordOfTheDay" />
      </li>
      <li>
        <GuessInput :disabled="hasGameEnded" @guess-submitted="guess => guessesSubmitted.push(guess)" />
      </li>
      <li v-for="i in countOfEmptyGuesses" :key="`remaining-guess-${i}`">
        <GuessView guess=""/>
      </li>
    </ul>

    <div v-if="hasGameEnded" class="end-of-game-message">
      <p>{{ guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : FAILURE_MESSAGE }}</p>
      ({{wordOfTheDay}}) <a href="#" @click.prevent="replayGame">Play again?</a>
    </div>
  </main>
</template>

<style scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;

    h1 {
      font-family: cursive;
      font-size: 3rem;
      letter-spacing: 3px;
      margin-bottom: 1rem;
    }

    .end-of-game-message {
      font-size: 3rem;
      animation: end-of-game-message-animation 700ms forwards;
      white-space: nowrap;
      text-align: center;

      p {
        margin-bottom: 0;
      }

      a{
        font-size: 1.5rem;
        text-decoration: none;
      }
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    
      li {
        margin-bottom: 0.25rem;
      }
    }
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
