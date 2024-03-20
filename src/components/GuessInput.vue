<script setup lang="ts">
  import { WORD_SIZE, ARIA_LABEL_PROMPT } from './strings'
  import englishWords from './englishWordsWith5Letters.json'
  import GuessView from './GuessView.vue';
  import { computed, ref } from 'vue'

  withDefaults(defineProps<{ disabled?: boolean }>(), {disabled: false})

  const guessInProgress = ref<string | null>(null)
  const hasFailedValidation = ref<boolean>(false)

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
    if (!englishWords.includes(formattedGuessInProgress.value)) {
      hasFailedValidation.value = true
      setTimeout(() => hasFailedValidation.value = false, 500)

      return
    }

    emit('guessSubmitted', formattedGuessInProgress.value)
    guessInProgress.value = null
  }

</script>

<template>
  <GuessView v-if="!disabled" :class="{shake: hasFailedValidation}" :guess="formattedGuessInProgress"/>

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

  .shake {
    animation: shake;
    animation-duration: 100ms;
    animation-iteration-count: 2;
  }

  @keyframes shake {
    0% {
      transform: translateX(-2%);
    }

    25% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(2%);
    }

    75% {
      transform: translateX(0);
    }
  }
</style>
