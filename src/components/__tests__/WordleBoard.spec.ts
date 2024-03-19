import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { FAILURE_MESSAGE, VICTORY_MESSAGE, WORD_SIZE } from '../strings'

describe('WordleBoard', () => {
  // it('renders the msg properly', () => {
  //   const wrapper = mount(WordleBoard, { props: { msg: 'Hello Vitest' } })
  //   expect(wrapper.text()).toContain('Hello Vitest')
  // })
  const wordOfTheDay = "TESTS"
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue(guess)
    await guessInput.trigger("keydown.enter")
  }

  describe("End of game messages", () => {  
    test("A victory message appears when the user makes a guess that mathes the word of the day", async() => {
      await playerSubmitsGuess(wordOfTheDay)
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
  
    test("A defeat message appears if the user makes a guess that is incorrect", async() => {
      await playerSubmitsGuess("WRONG")
      expect(wrapper.text()).toContain(FAILURE_MESSAGE)
    })
  
    test("No end of game message appears if the user has not yet made a guess", async() => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(FAILURE_MESSAGE)
    })
  })

  describe("Rules for defining the word of the day", () => {
    beforeEach(() => {
      console.warn = vi.fn()
    })
    test.each(
      [
        {wordOfTheDay: "FLY", reason: `word must have ${WORD_SIZE} characters` },
        {wordOfTheDay: "tests", reason: "word must be uppercase" },
        {wordOfTheDay: "TEST1", reason: "word must be a valid word" },
      ]
      )("Since $reason, $wordOfTheDay is invalid. So a warning is emitted", async({ wordOfTheDay }) => {
      mount(WordleBoard, {props: { wordOfTheDay }})
      expect(console.warn).toHaveBeenCalled()
    })
  
    test(`No warning is omitted if the word of the day provided is a ${WORD_SIZE} letter uppercase word`, async() => {
      mount(WordleBoard, {props: { wordOfTheDay: "TESTS" }})
      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe("Player input", () => {
    test(`Player guesses are limited to ${WORD_SIZE} letters`, async() => {
      await playerSubmitsGuess("TEST1")

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(FAILURE_MESSAGE)
    })

    test("Player guesses can only be submitted if they are real words", async() => {
      await playerSubmitsGuess(wordOfTheDay + "EXTRA")

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test("Player guesses are not case sensitive", async() => {
      await playerSubmitsGuess(wordOfTheDay.toLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test("Player guesses can only contain letters", async() => {
      await playerSubmitsGuess("H3!RT")

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual("HRT")
    })

    test("Non letter characters do not render on the screen while being typed", async () => {
      await playerSubmitsGuess("333")

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual("")
    })
  })

})
