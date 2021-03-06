/**
 * appHooks/apphub/pre.js
 * checks for a valid apphub file
 *
 * @exports {Class}
 */

import AppHook from '~/appHooks/appHook'

class AppHub extends AppHook {
  constructor (data) {
    super(data, {
      name: 'apphub',
      post: true
    })
  }

  async test () {
    const apphub = await this.file('.apphub')

    if (apphub == null) {
      this.error('exist')
      return
    }

    let data = {}
    try {
      const buffer = new Buffer(apphub, 'base64').toString()
      if (!/\S/.test(buffer)) return
      data = JSON.parse(buffer)
    } catch (error) {
      this.meta({ dump: error })
      this.error('parse')
      return
    }

    if (typeof data.priceUSD !== 'undefined' && typeof data.priceUSD !== 'number') {
      this.warn('price')
    } else if (data.priceUSD != null) {
      this.update({application: {package: {price: data.priceUSD}}})
    }

    if (typeof data.issueLabel !== 'undefined' && typeof data.issueLabel !== 'string') {
      this.warn('label')
    } else if (data.issueLabel != null) {
      this.update({application: {'github.label': data.issueLabel}})
    }

    return
  }
}

export default AppHub
