import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { FAILURE_MESSAGE, VICTORY_MESSAGE } from '../strings'

describe('WordleBoard', () => {
  // it('renders the msg properly', () => {
  //   const wrapper = mount(WordleBoard, { props: { msg: 'Hello Vitest' } })
  //   expect(wrapper.text()).toContain('Hello Vitest')
  // })

  test("A victory message appears when the user makes a guess that mathes the word of the day", async() => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: "TESTS" } })

    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue("TESTS")
    await guessInput.trigger("keydown.enter")

    expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  })

  test("A defeat message appears if the user makes a guess that is incorrect", async() => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: "TESTS" } })

    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue("WRONG")
    await guessInput.trigger("keydown.enter")

    expect(wrapper.text()).toContain(FAILURE_MESSAGE)
  })
  test.todo("No end of game message appears if the user has not yet made a guess", async() => {})
})
