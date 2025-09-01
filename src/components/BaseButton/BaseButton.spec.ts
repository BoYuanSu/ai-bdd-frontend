import { screen, render } from '@testing-library/vue'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {

    render(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  it('emits click event when clicked', async () => {
    const { emitted } = render(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })
    screen.getByRole('button').click()
    expect(emitted().click).toBeTruthy()
  })
})