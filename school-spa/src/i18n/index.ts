import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pl from './locales/pl.json'

const messages = {
  en,
  pl
}

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages
})

export default i18n
