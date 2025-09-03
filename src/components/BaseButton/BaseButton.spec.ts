import { render } from 'vitest-browser-vue'
import { page, userEvent } from '@vitest/browser/context'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  const user = userEvent.setup()

  it('renders slot content', async () => {

    const { getByText } = render(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })

    expect(getByText('Click me')).toBeInTheDocument()
    await page.screenshot({ path: './button.png' })
  })
  it('emits click event when clicked', async () => {
    const mockClick = vi.fn()
    const { emitted, getByRole } = render(BaseButton, {
      slots: {
        default: 'Click me'
      },
      props: {
        onClick: mockClick
      }
    })
    const btn = getByRole('button')
    await user.click(btn)
    expect(emitted().click).toBeTruthy()
    await page.screenshot({ path: './button2.png' })
  })
})