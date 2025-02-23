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

export function toNumber(v: any): number | undefined {
  if (lodash.isNumber(v)) {
    return v
  }

  if (lodash.isUndefined(v) || lodash.isNull(v)) {
    return undefined
  }

  return lodash.toNumber(v)
}
