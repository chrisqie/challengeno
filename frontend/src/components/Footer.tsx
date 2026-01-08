import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="mt-2 pb-20 bg-transparent">
      <div className="container mx-auto px-4 py-1">
        <div className="text-center space-y-0.5">
          <p className="text-sm text-gray-700">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-gray-600">
            {t('footer.craftedBy')}
          </p>
          <p className="text-xs text-gray-500">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

