<script setup lang="ts">
  import { WORD_SIZE } from './strings'

  defineProps<{ guess: string }>()
</script>

<template>
  <div id="wordle">
    <ul class="word">
      <li v-for="(letter, index) in guess.padEnd(WORD_SIZE, ' ')" 
        :key="`${letter}-${index}`"
        :data-letter="letter"
        class="letter"
        v-text="letter"  
      />
    </ul>
  </div>
</template>

<style scoped>
  ul {
    margin: 0;
    padding: 0;
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