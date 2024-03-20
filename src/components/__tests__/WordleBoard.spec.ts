import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { FAILURE_MESSAGE, VICTORY_MESSAGE, WORD_SIZE, MAX_GUESSES } from '../strings'
import GuessView from "../GuessView.vue"

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
  
    describe.each([
      // { numberOfGuesses: 0, shouldSeeDefeatMessage: false },
      // { numberOfGuesses: 1, shouldSeeDefeatMessage: false },
      // { numberOfGuesses: 2, shouldSeeDefeatMessage: false },
      // { numberOfGuesses: 3, shouldSeeDefeatMessage: false },
      // { numberOfGuesses: 4, shouldSeeDefeatMessage: false },
      // { numberOfGuesses: 5, shouldSeeDefeatMessage: false },
      // { numberOfGuesses: MAX_GUESSES, shouldSeeDefeatMessage: true },
      
      // Or we can do the same thing with the following:
      Array.from(
        { length: MAX_GUESSES + 1 }, 
        (_, numberOfGuesses) => ({ 
          numberOfGuesses,
          shouldSeeDefeatMessage: numberOfGuesses === MAX_GUESSES 
        })
      )
    ])(`A defeat message should appear if the player makes ${MAX_GUESSES} incorrect guesses in a row`, ({ numberOfGuesses, shouldSeeDefeatMessage }) => {
      test(`therefore for ${numberOfGuesses} guess(es), a defeat message should${shouldSeeDefeatMessage ? '' : 'not'} appear`, async() => {
        for(let i = 0; i < numberOfGuesses; i++) {
          await playerSubmitsGuess("WRONG")
        }

        if(shouldSeeDefeatMessage) {
          expect(wrapper.text()).toContain(VICTORY_MESSAGE)
        } else {
          expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
        }
      })
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
            {wordOfTheDay: "FLY", reason: "word-of-the-day must have 5 characters"},
            {wordOfTheDay: "tests", reason: "word-of-the-day must be all in uppercase"},
            {wordOfTheDay: "QWERT", reason: "word-of-the-day must be a valid English word"}
        ]
    )("Since $reason: $wordOfTheDay is invalid, therefore a warning must be emitted", async ({wordOfTheDay}) => {
        mount(WordleBoard, {props: {wordOfTheDay}})

        expect(console.warn).toHaveBeenCalled()
    })

    test("no warning is emitted if the word of the day provided is a real uppercase English word with 5 characters", async () => {
        mount(WordleBoard, {props: {wordOfTheDay: "TESTS"}})

        expect(console.warn).not.toHaveBeenCalled()
    })
})

describe("Player input", () => {
    test("remains in focus the entire time", async () => {
        document.body.innerHTML = `<div id="app"></div>`
        wrapper = mount(WordleBoard, {
            props: {wordOfTheDay},
            attachTo: "#app"
        })

        expect(wrapper.find("input[type=text]").attributes("autofocus")).not.toBeUndefined()

        await wrapper.find("input[type=text]").trigger("blur")
        expect(document.activeElement).toBe(wrapper.find("input[type=text]").element)
    })

    test("the input gets cleared after each submission", async () => {
        await playerSubmitsGuess("WRONG")

        expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("")
    })

    test(`player guesses are limited to ${WORD_SIZE} letters`, async () => {
        await playerSubmitsGuess(wordOfTheDay + "EXTRA")

        expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test("player guesses can only be submitted if they are real words", async () => {
        await playerSubmitsGuess("QWERT")

        expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
        expect(wrapper.text()).not.toContain(FAILURE_MESSAGE)
    })

    test("player guesses are not case-sensitive", async () => {
        await playerSubmitsGuess(wordOfTheDay.toLowerCase())

        expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test("player guesses can only contain letters", async () => {
        await playerSubmitsGuess("H3!RTTT")

        expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("HRTTT")
    })

    test("non-letter characters do not render on the screen while being typed", async () => {
        await playerSubmitsGuess("123")
        await playerSubmitsGuess("456")

        expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("")
    })

    test("the player loses control after the max amount of guesses have been sent", async () => {
        const guesses = [
            "WRONG",
            "GUESS",
            "HELLO",
            "WORLD",
            "HAPPY",
            "CODER"
        ]

        for (const guess of guesses) {
            await playerSubmitsGuess(guess)
        }

        expect(wrapper.find("input[type=text]").attributes("disabled")).not.toBeUndefined()
    })

    test("the player loses control after the correct guess has been given", async () => {
        await playerSubmitsGuess(wordOfTheDay)

        expect(wrapper.find("input[type=text]").attributes("disabled")).not.toBeUndefined()
    })
})

test("all previous guesses done by the player are visible in the page", async () => {
    const guesses = [
        "WRONG",
        "GUESS",
        "HELLO",
        "WORLD",
        "HAPPY",
        "CODER"
    ]

    for (const guess of guesses) {
        await playerSubmitsGuess(guess)
    }

    for (const guess of guesses) {
        expect(wrapper.text()).toContain(guess)
    }
})

describe(`there should always be exactly ${MAX_GUESSES} guess-views in the board`, async () => {
    test(`${MAX_GUESSES} guess-views are present at the start of the game`, async () => {
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-views are present when the player wins the game`, async () => {
        await playerSubmitsGuess(wordOfTheDay)

        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-views are present as the player loses the game`, async () => {
        const guesses = [
            "WRONG",
            "GUESS",
            "HELLO",
            "WORLD",
            "HAPPY",
            "CODER"
        ]

        for (const guess of guesses) {
            await playerSubmitsGuess(guess)
            expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
        }
    })
})
})