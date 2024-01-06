import logoAssetUrl from '~/assets/logo.svg'

export function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export const logoUrl = logoAssetUrl
