import lodash from 'lodash'

const curlRegex = /curl\/(\d+)\.(\d+)\.(\d+)/i

export function isCurl(ua: string): boolean {
  return curlRegex.test(ua)
}

export function formatRGBAColor(color: string | undefined): string | undefined {
  if (!color) {
    return color
  }

  if (lodash.isEmpty(color)) {
    return color
  }

  if (color.startsWith('#')) {
    return color
  }

  return `#${color}`
}
