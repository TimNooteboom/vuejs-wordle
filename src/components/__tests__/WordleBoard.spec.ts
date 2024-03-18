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
