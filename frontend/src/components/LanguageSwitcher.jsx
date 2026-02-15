import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className='flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary-700 transition-colors rounded-lg hover:bg-primary-50'
      title={i18n.language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      <Globe className='w-4 h-4' />
      <span className='font-medium uppercase'>{i18n.language}</span>
    </button>
  )
}

export default LanguageSwitcher
