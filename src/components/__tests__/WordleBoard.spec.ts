import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { FAILURE_MESSAGE, VICTORY_MESSAGE } from '../strings'

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

  async function playerSubmitGuess(guess: string) {
    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue(guess)
    await guessInput.trigger("keydown.enter")
  }

  describe("End of game messages", () => {  
    test("A victory message appears when the user makes a guess that mathes the word of the day", async() => {
      await playerSubmitGuess(wordOfTheDay)
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
  
    test("A defeat message appears if the user makes a guess that is incorrect", async() => {
      await playerSubmitGuess("WRONG")
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
        {wordOfTheDay: "FLY", reason: "word of the day must have 5 characters" },
        {wordOfTheDay: "tests", reason: "word of the day must be all in uppercase" },
        {wordOfTheDay: "TEST1", reason: "word of the day must be a valid English word" },
      ]
      )("Since $reason $wordOfTheDay is invalid, therefore a warning is emitted", async({ wordOfTheDay }) => {
      mount(WordleBoard, {props: { wordOfTheDay }})
      expect(console.warn).toHaveBeenCalled()
    })
  
    test("No warning is omitted if the word of the day provided is a 5 letter uppercase word", async() => {
      mount(WordleBoard, {props: { wordOfTheDay: "TESTS" }})
      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe("Player input", () => {
    test.todo("Player guesses are limited to 5 letters")
    test.todo("Player guesses can only be submitted if they are real words")
    test.todo("Player guesses are not case sensitive")
    test.todo("Player guesses can only contain letters")
  })

})
