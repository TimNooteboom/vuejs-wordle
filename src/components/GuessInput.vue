<script setup lang="ts">
  import { WORD_SIZE, ARIA_LABEL_PROMPT } from './strings'
  import englishWords from './englishWordsWith5Letters.json'
  import GuessView from './GuessView.vue';
  import { computed, ref } from 'vue'

  withDefaults(defineProps<{ disabled?: boolean }>(), {disabled: false})

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
  <GuessView v-if="!disabled" :guess="formattedGuessInProgress"/>

  <input v-model="formattedGuessInProgress"
    :maxlength="WORD_SIZE"
    :disabled="disabled"
    :aria-label="ARIA_LABEL_PROMPT"
    autofocus
    @blur="({target}) => (target as HTMLInputElement).focus()"
    type="text"
    @keydown.enter="onSubmit"
  >
</template>

<style scoped>
  input {
    position: absolute;
    opacity: 0;
  }
</style>
