<script setup lang="ts">
import { WORD_SIZE, ARIA_LABEL_PROMPT, NOT_VALID, DUPLICATE_GUESS } from './strings'
import englishWords from './englishWordsWith5Letters.json'
import GuessView from './GuessView.vue'
import { computed, inject, ref, watch } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  letter: {
    type: String,
    default: ''
  }
})

const guessInProgress = ref<string>('')
const hasFailedValidation = ref<boolean>(false)

const guessesSubmitted = inject('guessesSubmitted', ref<string[]>([]))

const emit = defineEmits<{
  guessSubmitted: [guess: string]
  screenButtonClicked: []
  failedValidation: [val: string]
}>()

const formattedGuessInProgress = computed<string>({
  get() {
    return guessInProgress.value ?? ''
  },
  set(newValue: string) {
    guessInProgress.value = ''

    guessInProgress.value = newValue
      .slice(0, WORD_SIZE)
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
  }
})

function onSubmit() {
  const notAWord = !englishWords.includes(formattedGuessInProgress.value)
  const alreadyGuessed = guessesSubmitted.value.includes(formattedGuessInProgress.value)
  if (notAWord || alreadyGuessed) {
    notAWord ? emit('failedValidation', NOT_VALID) : emit('failedValidation', DUPLICATE_GUESS)

    hasFailedValidation.value = true
    setTimeout(() => (hasFailedValidation.value = false), 500)
    return
  }

  emit('guessSubmitted', formattedGuessInProgress.value)
  guessInProgress.value = ''
}

watch(
  () => props.letter,
  (newLetter) => {
    if (newLetter === 'DEL') {
      guessInProgress.value = guessInProgress.value.slice(0, -1)
    } else if (newLetter === 'ENTER') {
      onSubmit()
    } else if (newLetter && guessInProgress?.value.length < WORD_SIZE) {
      guessInProgress.value += newLetter
    }
    // clear the button pushed so it can be typed again and the watch will pick it up
    emit('screenButtonClicked')
  },
  { deep: true }
)
</script>

<template>
  <GuessView
    v-if="!props.disabled"
    :class="{ shake: hasFailedValidation }"
    :guess="formattedGuessInProgress"
  />

  <input
    v-model="formattedGuessInProgress"
    :maxlength="WORD_SIZE"
    :disabled="props.disabled"
    :aria-label="ARIA_LABEL_PROMPT"
    autofocus
    @blur="({ target }) => (target as HTMLInputElement).focus()"
    type="text"
    @keydown.enter="onSubmit"
  />
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
