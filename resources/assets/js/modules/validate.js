export const PATTERN = {
  'phone': /[0-9]{6,15}$/,
  'email': /[A-Za-z0-9._%+-]+@[A-Za-z0-9\-.]+\.[A-Za-z]{2,4}$/,
  'name': /^[^\d+=()[\]{}\\/^$|?*!@#%:;&,_.]{3,30}$/,
  'last_name': /^[^\d+=()[\]{}\\/^$|?*!@#%:;&,_.]{3,30}$/,
  'promo': /[0-9]{3,3}$/
}

export default class Validate {
  static input (pattern, selector) {
    let val = selector.value
    let cls = selector.classList

    if (val.length > 0) {
      if (!(val.search(pattern) === 0) && val.length > 0 || val.replace(/\s/g, '') === '') {
        cls.remove('valid')
        cls.add('error')
        return false
      }

      cls.remove('error')
      cls.add('valid')
      return true
    } else {
      cls.remove('error', 'valid')
      return false
    }
  }
}
