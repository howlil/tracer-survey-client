declare module 'react-google-recaptcha' {
  import { Component } from 'react'

  export interface ReCAPTCHAProps {
    sitekey: string
    onChange?: (token: string | null) => void
    onExpired?: () => void
    onError?: () => void
    theme?: 'light' | 'dark'
    type?: 'image' | 'audio'
    size?: 'compact' | 'normal' | 'invisible'
    tabindex?: number
    hl?: string
    ref?: React.Ref<ReCAPTCHA>
  }

  export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
    reset(): void
    execute(): void
    getValue(): string | null
  }
}
