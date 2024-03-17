import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE } from '../strings'

describe('WordleBoard', () => {
  // it('renders the msg properly', () => {
  //   const wrapper = mount(WordleBoard, { props: { msg: 'Hello Vitest' } })
  //   expect(wrapper.text()).toContain('Hello Vitest')
  // })

  test("A victory message appears when the user makes a guess that mathes the word of the day", async() => {
    // Arrange
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: "TESTS" } })

    // Act
    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue("TESTS")
    await guessInput.trigger("keydown.enter")

    // Assert
    expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  })
})
