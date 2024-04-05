<script setup lang="ts">
  import { FAILURE_MESSAGE, MAX_GUESSES, VICTORY_MESSAGE } from './strings'
  import englishWords from './englishWordsWith5Letters.json'
  import { ref, type Ref, computed, provide } from 'vue'
  import GuessInput from './GuessInput.vue'
  import GuessView from './GuessView.vue'
  import JSConfetti from 'js-confetti'
  
  const jsConfetti = new JSConfetti()

  let screenLetter: Ref<string> = ref('')

  const wordOfTheDay: string = englishWords[Math.floor(Math.random() * englishWords.length)]
  console.log(wordOfTheDay)

  const guessesSubmitted = ref<string[]>([])

  const replayGame = () => {
    window.location.reload()
  }

  const addGuess = (guess: string) => {
    guessesSubmitted.value.push(guess)
    // filter out the duplicate letters from the guess
    let uniqueGuessArray = [...new Set(guess.split(''))] // 'happy' only gives us ['h', 'a', 'p', 'y']
    // find the unique letters that are not already in the selectedLetters array
    const uniqueLetters = uniqueGuessArray.filter(letter => !selectedLetters.value.includes(letter))
    selectedLetters.value = selectedLetters.value.concat(uniqueLetters)
    // we can also use a set and do this in one line but I like the readability of the code above
    // selectedLetters.value = [...new Set(selectedLetters.value.concat(guess.split('')))]
    
    if (hasGameWon.value) {
      jsConfetti.addConfetti()
    }
  }

  const clickLetter = (letter: string) => {
    screenLetter.value = letter
  }

  const hasGameWon = computed(() => guessesSubmitted.value.includes(wordOfTheDay))

  const hasGameEnded = computed(() => 
    guessesSubmitted.value.length === MAX_GUESSES || hasGameWon.value)

  const countOfEmptyGuesses = computed(() => {
    const guessesRemaining = MAX_GUESSES - guessesSubmitted.value.length

    return hasGameEnded.value ? guessesRemaining : guessesRemaining - 1
  })

  const selectedLetters = ref<string[]>([])

  const isSelected = (letter: string) => selectedLetters.value.includes(letter)

  const keyboardLetters = ref([
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['DEL', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
  ])

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
        <GuessInput :disabled="hasGameEnded" @guess-submitted="guess => addGuess(guess)" :letter="screenLetter" @screen-button-clicked="screenLetter = ''" />
      </li>
      <li v-for="i in countOfEmptyGuesses" :key="`remaining-guess-${i}`">
        <GuessView guess=""/>
      </li>
    </ul>

    <div v-if="hasGameEnded" class="end-of-game-message">
      <p v-if="hasGameWon">{{ VICTORY_MESSAGE }}</p>
      <p v-else>{{ FAILURE_MESSAGE }} <span>({{ wordOfTheDay }})</span></p>
      <a href="#" @click.prevent="replayGame">Play again?</a>
    </div>

    <!-- On screen keyboard -->
    <div class="letters">
      <div class="row" v-for="(row, index) in keyboardLetters" :key="`row-${index}`">
        <button v-for="letter in row" :key="letter" :class="{ selected: isSelected(letter) }" @click="clickLetter(letter)">{{ letter }}</button>
      </div>
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

    .letters {
      margin-top: 100px;

      .row {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 10px;

        button {
          font-size: 1.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid black;
          border-radius: 5px;
          background-color: white;
          cursor: pointer;
          &:hover, &.selected {
            background-color: lightgray;
          }
        }
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
