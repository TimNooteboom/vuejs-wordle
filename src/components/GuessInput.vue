<script setup lang="ts">
  import { WORD_SIZE } from './strings'
  import englishWords from './englishWordsWith5Letters.json'
  import { computed, ref } from 'vue'

  const guessInProgress = ref<string|null>(null)
  const emit = defineEmits<{
    "guessSubmitted": [guess: string]
  }>()

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
      emit('guessSubmitted', formattedGuessInProgress.value)
    }
    guessInProgress.value = null
  }

</script>

<template>
  <div id="wordle">
    <ul class="word">
      <li v-for="(letter, index) in formattedGuessInProgress.padEnd(WORD_SIZE, ' ')" 
        :key="`${letter}-${index}`"
        :data-letter="letter"
        class="letter"
        v-text="letter"  
      />
    </ul>

    {{ guessInProgress }}<br/>
    <input v-model="formattedGuessInProgress" 
      :maxlength="WORD_SIZE" 
      autofocus
      @blur="({target}) => (target as HTMLInputElement).focus()"
      type="text"
      @keydown.enter="onSubmit"
    >
  </div>
</template>

<style scoped>

  input {
    position: absolute;
    opacity: 0;
  }

  .word {
    display: flex;
    gap: 0.25rem;
    list-style: none;
    padding: 0;
  }

  .letter {
    background-color: white;
    border: 1px solid hsl(0, 0%, 70%);
    width: 5rem;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bolder;
  }

  li:not([data-letter=" "]) {
    animation: pop 100ms;
  }

  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.4); }
  }

</style>
