import { useTranslation } from 'react-i18next'

export interface MenuItem {
  label: string
  href: string
  internal?: boolean
  overflow?: boolean
  closeMenu?: () => void
}

export interface MenuSection {
  title: string
  items: MenuItem[]
  closeMenu?: () => void
}

export const useMenuContent = (): MenuSection[] => {
  const { t } = useTranslation()

  return [
    {
      title: t('common.home'),
      items: [{ label: t('common.home'), href: '/', internal: true }],
    },
    {
      title: t('common.trade'),
      items: [{ label: t('common.trade'), href: '/swap', internal: true }],
    },
    {
      title: t('common.explore'),
      items: [{ label: t('common.explore'), href: '/explore', internal: true }],
    },
    {
      title: t('common.pool'),
      items: [{ label: t('common.pool'), href: '/positions', internal: true }],
    },
  ]
}
