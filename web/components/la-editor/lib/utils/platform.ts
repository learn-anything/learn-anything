export interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: {
    brands: { brand: string; version: string }[]
    mobile: boolean
    platform: string
    getHighEntropyValues: (hints: string[]) => Promise<{
      platform: string
      platformVersion: string
      uaFullVersion: string
    }>
  }
}

let isMac: boolean | undefined

const getPlatform = () => {
  const nav = navigator as NavigatorWithUserAgentData
  if (nav.userAgentData) {
    if (nav.userAgentData.platform) {
      return nav.userAgentData.platform
    }

    nav.userAgentData
      .getHighEntropyValues(['platform'])
      .then(highEntropyValues => {
        if (highEntropyValues.platform) {
          return highEntropyValues.platform
        }
      })
      .catch(() => {
        return navigator.platform || ''
      })
  }

  return navigator.platform || ''
}

export const isMacOS = () => {
  if (isMac === undefined) {
    isMac = getPlatform().toLowerCase().includes('mac')
  }

  return isMac
}

export default isMacOS
